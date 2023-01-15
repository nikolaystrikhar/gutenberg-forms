import React, { useEffect, Fragment } from "react";
import {
	FormToggle,
	PanelRow,
	PanelBody,
	RangeControl,
	Icon,
	TextControl,
} from "@wordpress/components";
import {
	getFieldName,
	extract_id,
	getEncodedData,
	extract_admin_id,
	get_admin_id,
} from "../../block/misc/helper";
import ConditionalLogic from "../../block/components/condition";
import { clone, set, assign } from "lodash";
import { getRootMessages, detectSimilarFields } from "../../block/functions";

const { __ } = wp.i18n;

const {
	InspectorControls,
	BlockControls,
	RichText,
} = wp.blockEditor;

function edit(props) {
	const handleChange = (e) => {
		let number = e.target.value;

		props.setAttributes({ number });
	};

	const handleRequired = () => {
		const { isRequired } = props.attributes;

		props.setAttributes({ isRequired: !isRequired });
	};

	const handleLabel = (label) => {
		props.setAttributes({ label });
	};

	const {
		number,
		isRequired,
		label,
		field_name,
		rangeMax,
		rangeMin,
		requiredLabel,
		messages: { invalid, empty },
		messages,
		steps,
		adminId,
		condition,
		enableCondition,
		hint,
		showHint
	} = props.attributes;

	const getRootData = () => {
		if (field_name === "" || detectSimilarFields(props.clientId, field_name)) {
			const newFieldName = getFieldName("number", props.clientId);

			props.setAttributes({
				field_name: newFieldName,
				adminId: {
					value: extract_admin_id(newFieldName, "number"),
					default: extract_admin_id(newFieldName, "number"),
				},
			});
			props.setAttributes({
				id:
					props.clientId +
					"__" +
					getEncodedData(
						"number",
						props.clientId,
						isRequired,
						get_admin_id(adminId)
					),
			});
		} else if (
			field_name !== "" &&
			detectSimilarFields(props.clientId, field_name)
		) {
			props.setAttributes({
				id:
					extract_id(field_name) +
					"__" +
					getEncodedData(
						"number",
						extract_id(field_name),
						isRequired,
						get_admin_id(adminId)
					),
			});
		} else if (
			field_name !== "" &&
			!detectSimilarFields(props.clientId, field_name)
		) {
			props.setAttributes({
				id:
					extract_id(field_name) +
					"__" +
					getEncodedData(
						"number",
						extract_id(field_name),
						isRequired,
						get_admin_id(adminId)
					),
			});
		}
	};

	useEffect(() => {
		let rootMessages = getRootMessages(props.clientId, "number");

		if (rootMessages) {
			const newMessages = clone(messages);

			assign(newMessages, rootMessages);

			props.setAttributes({ messages: newMessages });
		}

		getRootData();
	}, []);

	useEffect(() => {
		getRootData();
	}, [props]);

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

	return [
		!!props.isSelected && (
			<InspectorControls>
				<PanelBody title={__("Field Settings", "forms-gutenberg")} initialOpen={true}>
					<div className="cwp-option">
						<TextControl
							placeholder={adminId.default}
							label={__("Field ID", "forms-gutenberg")}
							value={adminId.value}
							onChange={handleAdminId}
						/>
					</div>

					{!enableCondition ? (
						<PanelRow>
							<h3 className="cwp-heading">{__("Required", "forms-gutenberg")}</h3>
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
						<RangeControl
							min={0}
							max={10000}
							value={steps}
							step={0.01}
							onChange={(steps) => props.setAttributes({ steps })}
							label="Steps"
						/>
						<div className="cwp-option">
							<RangeControl
								min={0}
								max={10000}
								step={0.01}
								value={rangeMax}
								onChange={(m) => props.setAttributes({ rangeMax: m })}
								label={__("Range Max", "forms-gutenberg")}
							/>
							<RangeControl
								min={0}
								step={0.01}
								value={rangeMin}
								max={10000}
								onChange={(m) => props.setAttributes({ rangeMin: m })}
								label={__("Range Min", "forms-gutenberg")}
							/>
						</div>
					</div>
				</PanelBody>

				<PanelBody title={__("Condition", "forms-gutenberg")}>
					<ConditionalLogic
						condition={condition}
						set={props.setAttributes}
						clientId={props.clientId}
						useCondition={props.attributes.enableCondition}
					/>
				</PanelBody>

				<PanelBody title="Messages">
					{isRequired && (
						<div className="cwp-option">
							<h3 className="cwp-heading">
								{__("Required Error", "forms-gutenberg")}
							</h3>
							<TextControl
								onChange={(label) => setMessages("empty", label)}
								value={empty}
							/>
						</div>
					)}
					<div className="cwp-option">
						<h3 className="cwp-heading">
							{__("Invalid Number Error", "forms-gutenberg")}
						</h3>
						<TextControl
							onChange={(v) => setMessages("invalid", v)}
							value={invalid}
						/>
					</div>
					<div className="cwp-option">
						<p>
							<Icon icon="info" />{" "}
							{__("Use {{value}} to insert field value!", "forms-gutenberg")}
						</p>
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
			</InspectorControls>
		),
		!!props.isSelected && <BlockControls></BlockControls>,
		<div className={`cwp-number cwp-field ${props.className}`}>
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
				<input
					value={number}
					max={rangeMax}
					step={steps}
					min={rangeMin}
					type="number"
					onChange={handleChange}
				/>
			</div>
			{showHint && (
                <p className="cwp-hint">{hint}</p>
            )}
		</div>,
	];
}

export default edit;
