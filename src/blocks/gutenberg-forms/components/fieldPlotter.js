import React, { useEffect, useState } from "react";
import {
	SelectControl,
	TextControl,
	FormTokenField,
	Notice,
} from "@wordpress/components";
import {
	map,
	isEmpty,
	has,
	clone,
	set,
	get,
	isEqual,
	each,
	includes,
	omit,
} from "lodash";
import { serializeFields } from "../../../block/misc/helper";

const { __ } = wp.i18n;

const { getBlock } = wp.data.select("core/block-editor");

function FieldPlotter({
	api_fields,
	clientId,
	data,
	name,
	fields,
	title,
	query_fields,
}) {
	const { integrations, actions } = data.attributes;

	const [error, setError] = useState("");

	useEffect(() => {
		if (!has(integrations, name)) {
			integrations[name] = {};
			data.setAttributes({ integrations });
		}
	}, []);

	const getOptions = (field) => {
		const root = getBlock(clientId);
		const child_fields = root.innerBlocks;
		const available_fields = serializeFields(child_fields);

		let options = available_fields.map((f, i) => {
			const fieldName = get(f, "fieldName"),
				blockName = get(f, "blockName"),
				adminId = get(f, "adminId");

			const field_label = isEmpty(fieldName)
				? get(adminId, "value")
				: fieldName;

			const option = {
				label: field_label,
				value: get(adminId, "value"),
				blockName,
			};

			return option;
		});

		const hasRestriction = has(field, "restriction"); // checking for field restrictions..

		if (hasRestriction && !isEmpty(get(field, "restriction"))) {
			const inRestrictionOptions = options.filter((option) =>
				isEqual(option.blockName, get(field, "restriction"))
			);
			return inRestrictionOptions;
		}

		return options;
	};

	const isFieldEmpty = (v, label = null) => {
		if (isEmpty(label)) {
			return isEqual("Select Field", v) || isEmpty(v);
		}

		return isEqual("Select Field", v) || isEmpty(v) || isEqual(label, v);
	};

	const testErrors = (updatedOptions) => {
		const f = Object.assign({}, api_fields, query_fields);

		let has_err = false;

		each(updatedOptions, (option, key) => {
			const hasKey = has(f, key);
			const isFieldRequired = get(get(f, key), "required");

			const field_label = get(get(f, key), "label");
			const fieldEmpty = isFieldEmpty(option, field_label);

			if (hasKey && isFieldRequired === true && fieldEmpty) {
				// this means a required field is not filled
				has_err = true;
			}
		});

		return has_err;
	};

	const handleFieldsChange = (key, val) => {
		// not mutating the original attribute
		const newIntegrations = clone(integrations);

		set(newIntegrations, name, {
			...get(integrations, name),
			[key]: val,
		});

		data.setAttributes({ integrations: newIntegrations });

		if (testErrors(get(newIntegrations, name))) {
			setError(__("Please Map All Required Fields", "forms-gutenberg"));
		} else {
			setError("");
		}
	};

	return (
		<div className="cwp-fields-plotter">
			{!isEmpty(error) && (
				<Notice status="error" isDismissible={false}>
					{error}
				</Notice>
			)}
			{map(query_fields, (field, key) => {
				const { label, value, type } = field;
				const currentValue = has(integrations[name], key)
					? integrations[name][key]
					: null;
				const field_label = (
					<span>
						{label}
						{has(field, "required") && get(field, "required") == true && (
							<strong color="red"> (Req)</strong>
						)}
					</span>
				);

				if (type === "select") {
					let mappedValues = value.map((v) => {
						return {
							value: v.value,
							label: v.name,
						};
					});

					let values = [
						{
							label,
							value: "",
						},
						...mappedValues,
					];

					return (
						<SelectControl
							label={__(field_label, "forms-gutenberg")}
							value={currentValue}
							options={values}
							onChange={(v) => handleFieldsChange(key, v)}
						/>
					);
				} else if (type === "text") {
					return (
						<TextControl
							label={__(label, "forms-gutenberg")}
							value={currentValue}
							onChange={(v) => handleFieldsChange(key, v)}
						/>
					);
				} else if (type === "tags") {
					const suggestions = has(value, "suggestions")
						? value.suggestions
						: [];

					const currentTokens = !isEmpty(currentValue) ? currentValue : [];
					const parsedValue =
						typeof currentTokens === "string"
							? currentTokens.split(",")
							: currentTokens;

					return (
						<FormTokenField
							label={__(field_label, "forms-gutenberg")}
							value={parsedValue}
							suggestions={suggestions}
							onChange={(tokens) => {
								handleFieldsChange(key, tokens);
							}}
						/>
					);
				}
			})}
			{map(api_fields, (field, key) => {
				const { label } = field;

				const value = has(integrations[name], key)
					? integrations[name][key]
					: null;

				const defaultValue = has(field, "default") ? field.default : "";

				const field_label = (
					<span>
						{label}
						{has(field, "required") && get(field, "required") == true && (
							<strong color="red"> (Req)</strong>
						)}
					</span>
				);

				return (
					<div className="cwp_field_plot">
						<SelectControl
							onChange={(val) => handleFieldsChange(key, val)}
							label={__(field_label, "forms-gutenberg")}
							value={value}
							options={[
								{
									label: "Select Field",
									value: defaultValue,
								},
								...getOptions(field),
							]}
						/>
					</div>
				);
			})}
		</div>
	);
}

export default FieldPlotter;
