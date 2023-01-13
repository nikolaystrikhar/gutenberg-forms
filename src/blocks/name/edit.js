import './style.scss';

import React, { useEffect, Fragment } from "react";
import {
	FormToggle,
	Toolbar,
	PanelRow,
	PanelBody,
	TextControl,
	Icon,
} from "@wordpress/components";
import {
	getFieldName,
	extract_id,
	getEncodedData,
	extract_admin_id,
	get_admin_id,
} from "../../block/misc/helper";
import {
	getRootMessages,
	detect_similar_forms,
} from "../../block/functions/index";
import ConditionalLogic from "../../block/components/condition";

import { clone, set, assign } from "lodash";
import Prefix from "../components/prefix";
import Suffix from "../components/suffix";

const { __ } = wp.i18n;
const { InspectorControls, BlockControls, BlockIcon, RichText } =
	wp.blockEditor;

function edit(props) {
	const handleChange = (e) => {
		let name = e.target.value;

		props.setAttributes({ name });
	};

	const handleRequired = () => {
		const { isRequired } = props.attributes;

		props.setAttributes({ isRequired: !isRequired });
	};

	const handleLabel = (label) => {
		props.setAttributes({ label });
	};

	const {
		name,
		isRequired,
		label,
		id,
		field_name,
		requiredLabel,
		messages: { empty, invalidName },
		messages,
		pattern,
		condition,
		enableCondition,
		adminId,
		prefix,
		suffix,
		showHint,
		hint
	} = props.attributes;

	const getRootData = () => {
		if (field_name === "" || detect_similar_forms(props.clientId)) {
			const newFieldName = getFieldName("name", props.clientId);

			props.setAttributes({
				field_name: newFieldName,
				adminId: {
					value: extract_admin_id(newFieldName, "name"),
					default: extract_admin_id(newFieldName, "name"),
				},
			});
			props.setAttributes({
				id:
					props.clientId +
					"__" +
					getEncodedData(
						"name",
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
						"name",
						extract_id(field_name),
						isRequired,
						get_admin_id(adminId)
					),
			});
		}
	};

	useEffect(() => {
		let rootMessages = getRootMessages(props.clientId, "name");

		if (rootMessages) {
			const newMessages = clone(messages);

			assign(newMessages, rootMessages);

			props.setAttributes({ messages: newMessages });
		}

		getRootData();
	}, []);

	useEffect(() => getRootData(), [props]);

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
								label="Required"
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
						<Fragment>
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
						</Fragment>
					)}
				</PanelBody>
				<PanelBody title={__("Condition", "forms-gutenberg")}>
					<ConditionalLogic
						condition={condition}
						set={props.setAttributes}
						clientId={props.clientId}
						useCondition={props.attributes.enableCondition}
					/>
				</PanelBody>
				<PanelBody title={__("Messages", "forms-gutenberg")}>
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
							{__("Invalid Name Error", "forms-gutenberg")}
						</h3>
						<TextControl
							onChange={(v) => setMessages("invalidName", v)}
							value={invalidName}
						/>
					</div>
					<div className="cwp-option">
						<p>
							<Icon icon="info" />{" "}
							{__(
								"Use {{value}} to insert field value!",
								"forms-gutenberg"
							)}
						</p>
					</div>
				</PanelBody>
				<PanelBody title={__("Validation", "forms-gutenberg")}>
					<div className="cwp-option">
						<TextControl
							label={__("Pattern (RegExp)", "forms-gutenberg")}
							onChange={(pattern) => props.setAttributes({ pattern })}
							value={pattern}
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
			</InspectorControls>
		),
		!!props.isSelected && <BlockControls></BlockControls>,
		<div className={`cwp-name cwp-field ${props.className}`}>
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
					<input value={name} onChange={handleChange} />
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
