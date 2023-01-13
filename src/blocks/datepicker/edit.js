import React, { useEffect,Fragment } from "react";
import {
	FormToggle,
	Toolbar,
	PanelRow,
	PanelBody,
	TextControl,
	SelectControl,
	Icon,

} from "@wordpress/components";
import {
	getFieldName,
	extract_id,
	getEncodedData,
	extract_admin_id,
	get_admin_id,
} from "../../block/misc/helper";
import DatePicker from "../../block/components/datepicker";
import { clone, set } from "lodash";
import ConditionalLogic from "../../block/components/condition";

import Prefix from "../components/prefix";
import Suffix from "../components/suffix";

const { InspectorControls, BlockControls, BlockIcon, RichText } =
	wp.blockEditor;
const { __ } = wp.i18n;

function edit(props) {
	const handleChange = (e) => {
		let placeholder = e.target.value;

		props.setAttributes({ placeholder });
	};

	const handleRequired = () => {
		const { isRequired } = props.attributes;

		props.setAttributes({ isRequired: !isRequired });
	};

	const handleLabel = (label) => {
		props.setAttributes({ label });
	};
	const inputField = React.useRef();

	const {
		placeholder,
		isRequired,
		label,
		id,
		field_name,
		requiredLabel,
		type,
		messages: { empty },
		messages,
		format,
		condition,
		enableCondition,
		adminId,
		prefix,
		suffix,
		hint,
		showHint,
	} = props.attributes;

	const getRootData = () => {
		if (field_name === "") {
			const newFieldName = getFieldName("datePicker", props.clientId);

			props.setAttributes({
				field_name: newFieldName,
				adminId: {
					value: extract_admin_id(newFieldName, "datePicker"),
					default: extract_admin_id(newFieldName, "datePicker"),
				},
			});
			props.setAttributes({
				id:
					props.clientId +
					"__" +
					getEncodedData(
						"datePicker",
						props.clientId,
						isRequired,
						get_admin_id(adminId)
					),
			});
		} else if (field_name !== "") {
			props.setAttributes({
				id:
					extract_id(field_name) +
					"__" +
					getEncodedData(
						"datePicker",
						extract_id(field_name),
						isRequired,
						get_admin_id(adminId)
					),
			});
		}
	};

	useEffect(() => {
		getRootData();
	}, []);

	useEffect(() => getRootData(), [props]);

	const getTypeActive = (t) => {
		if (type === t) {
			return {
				isDefault: true,
			};
		}

		return {
			isPrimary: true,
		};
	};

	let getFieldType = () => {
		switch (type) {
			case "both":
				return "datetime-local";
			case "time":
				return "time";
			case "date":
				return "date";
		}
	};

	const setMessages = (type, m) => {
		let newMessages = clone(messages);

		set(newMessages, type, m);

		props.setAttributes({ messages: newMessages });
	};

	const handleAdminId = (id) => {
		props.setAttributes({
			adminId: {
				...adminId,
				value: id.replace(/\s|-/g, "_"),
			},
		});
	};

	const handleInputElementChange = (type, property, value) => {
		const newSuffix = clone(suffix);
		const newPrefix = clone(prefix);

		switch (type) {
			case "suffix":
				set(newSuffix, property, value);
				props.setAttributes({ suffix: newSuffix });

				break;
			case "prefix":
				set(newPrefix, property, value);
				props.setAttributes({ prefix: newPrefix });
		}
	};

	return [
		!!props.isSelected && (
			<InspectorControls>
				<PanelBody
					title={__("Field Settings", "forms-gutenberg")}
					initialOpen={true}
				>
					<div className="cwp-option">
						<TextControl
							placeholder={adminId.default}
							label={__("Field ID", "forms-gutenberg")}
							value={adminId.value}
							onChange={handleAdminId}
						/>
					</div>

					<div className="cwp-option">
						<PanelRow>
							<h3 className="cwp-heading">
								{__("Prefix", "forms-gutenberg")}
							</h3>
							<FormToggle
								label="Prefix"
								checked={prefix.enable}
								onChange={() =>
									handleInputElementChange("prefix", "enable", !prefix.enable)
								}
							/>
						</PanelRow>
					</div>

					<div className="cwp-option">
						<PanelRow>
							<h3 className="cwp-heading">
								{__("Suffix", "forms-gutenberg")}
							</h3>
							<FormToggle
								label="Suffix"
								checked={suffix.enable}
								onChange={() =>
									handleInputElementChange("suffix", "enable", !suffix.enable)
								}
							/>
						</PanelRow>
					</div>

					{!enableCondition ? (
						<PanelRow>
							<h3 className="cwp-heading">
								{__("Required", "forms-gutenberg")}
							</h3>
							<FormToggle
								label={__("Required", "forms-gutenberg")}
								checked={isRequired}
								onChange={handleRequired}
							/>
						</PanelRow>
					) : (
						<div className="cwp-option">
							<p>
								<Icon icon="info" />{" "}
								{__(
									"You cannot set a conditional field required!",
									"forms-gutenberg"
								)}
							</p>
						</div>
					)}
					{isRequired && (
						<div className="cwp-option">
							<h3 className="cwp-heading">
								{__("Required Text", "forms-gutenberg")}
							</h3>
							<TextControl
								onChange={(label) =>
									props.setAttributes({ requiredLabel: label })
								}
								value={requiredLabel}
							/>
						</div>
					)}
					<div className="cwp-option">
						<SelectControl
							label={__("Format", "forms-gutenberg")}
							value={format}
							options={[
								{
									label: __("Day Month Year", "forms-gutenberg"),
									value: "DD/MM/YYYY",
								},
								{
									label: __("Month Day Year", "forms-gutenberg"),
									value: "MM/DD/YYYY",
								},
								{
									label: __("Year Month Day", "forms-gutenberg"),
									value: "YYYY/MM/DD",
								},
							]}
							onChange={(format) => {
								props.setAttributes({ format });
							}}
						/>
					</div>
				</PanelBody>
				<PanelBody title={__("Show Hint", "forms-gutenberg")}>
					<div className="cwp-option">
						<FormToggle
							label="Show Hint"
							checked={showHint}
							onChange={() => props.setAttributes({ showHint: !showHint })}
						/>
						{showHint && (
							<Fragment>
								<TextControl
									label={__("Hint Text", "forms-gutenberg")}
									onChange={(hint) => props.setAttributes({ hint })}
									value={hint}
								/>
							</Fragment>
						)}
					</div>
				</PanelBody>
				<PanelBody title="Condition">
					<ConditionalLogic
						condition={condition}
						set={props.setAttributes}
						clientId={props.clientId}
						useCondition={props.attributes.enableCondition}
					/>
				</PanelBody>
				{isRequired && (
					<PanelBody title="Messages">
						<div className="cwp-option">
							<h3 className="cwp-heading">
								{__("Required Error", "forms-gutenberg")}
							</h3>
							<TextControl
								onChange={(label) => setMessages("empty", label)}
								value={empty}
							/>
						</div>
					</PanelBody>
				)}
			</InspectorControls>
		),
		!!props.isSelected && <BlockControls></BlockControls>,
		<div className={`cwp-field cwp-datepicker ${props.className}`}>
			<div className="cwp-field-set">
				<div className="cwp-label-wrap">
					<RichText
						placeholder={__("Add a label", "forms-gutenberg")}
						tag="label"
						value={label}
						onChange={handleLabel}
					/>
					{!props.isSelected && isRequired && !enableCondition && (
						<div className="cwp-required cwp-noticed">
							<h3>{requiredLabel}</h3>
						</div>
					)}
				</div>
				<div className="cwp-field-with-elements">
					{prefix.enable && (
						<Prefix prefix={prefix}>
							<RichText
								placeholder={__("Prefix", "forms-gutenberg")}
								tag="span"
								value={prefix.content}
								onChange={(newContent) =>
									handleInputElementChange("prefix", "content", newContent)
								}
							/>
						</Prefix>
					)}
					{format === "DD/MM/YYYY" && (
						<DatePicker
							format={format}
							value={placeholder}
							onChange={handleChange}
							setAttributes={props.setAttributes}
						/>
					)}
					{format === "MM/DD/YYYY" && (
						<DatePicker
							format={format}
							value={placeholder}
							onChange={handleChange}
							setAttributes={props.setAttributes}
						/>
					)}
					{format === "YYYY/MM/DD" && (
						<DatePicker
							setAttributes={props.setAttributes}
							format={format}
							value={placeholder}
							onChange={handleChange}
						/>
					)}
					{suffix.enable && (
						<Suffix suffix={suffix}>
							<RichText
								placeholder={__("Suffix", "forms-gutenberg")}
								tag="span"
								value={suffix.content}
								onChange={(newContent) =>
									handleInputElementChange("suffix", "content", newContent)
								}
							/>
						</Suffix>
					)}
				</div>
			</div>
			{showHint && (
                <p className="cwp-hint">{hint}</p>
            )}
		</div>,
	];
}

export default edit;
