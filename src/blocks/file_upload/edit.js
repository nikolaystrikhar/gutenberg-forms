import React, { useEffect, Fragment } from "react";
import {
	FormToggle,
	Toolbar,
	PanelRow,
	PanelBody,
	TextControl,
	Icon,
	FormTokenField
} from "@wordpress/components";
import {
	getFieldName,
	extract_id,
	getEncodedData,
	extract_admin_id,
	get_admin_id
} from "../../block/misc/helper";
import { getRootMessages, getRootFormBlock, detect_similar_forms } from "../../block/functions/index";
import ConditionalLogic from "../../block/components/condition";

import { clone, set, assign, isEqual } from "lodash";
import { TEXT_DOMAIN } from "../../block/constants";

const {
	InspectorControls,
	BlockControls,
	RichText
} = wp.blockEditor;
const { updateBlockAttributes } = wp.data.dispatch("core/block-editor");
const { __ } = wp.i18n;


function edit(props) {
	const handleChange = e => {
		let file = e.target.value;

		props.setAttributes({ file });
	};

	const handleRequired = () => {
		const { isRequired } = props.attributes;

		props.setAttributes({ isRequired: !isRequired });
	};

	const handleLabel = label => {
		props.setAttributes({ label });
	};

	const {
		file,
		isRequired,
		label,
		id,
		field_name,
		requiredLabel,
		messages: { empty, invalid },
		messages,
		condition,
		enableCondition,
		allowedFormats,
		adminId
	} = props.attributes;

	useEffect(() => {
		// setting the root encryption for form-data;

		const rootForm = getRootFormBlock(props.clientId);

		updateBlockAttributes(rootForm.clientId, { encryption: "multipart/form-data" }); //? like a piece of cake

	}, [])

	const setRootData = () => {
		if (field_name === "" || detect_similar_forms(props.clientId)) {


			const newFieldName = getFieldName("file_upload", props.clientId);


			props.setAttributes({
				field_name: newFieldName,
				adminId: {
					value: extract_admin_id(newFieldName, 'file_upload'),
					default: extract_admin_id(newFieldName, 'file_upload')
				}
			});
			props.setAttributes({
				id:
					props.clientId +
					"__" +
					getEncodedData("file_upload", props.clientId, isRequired, get_admin_id(adminId), JSON.stringify(allowedFormats))
			});
		} else if (field_name !== "") {
			props.setAttributes({
				id:
					extract_id(field_name) +
					"__" +
					getEncodedData("file_upload", extract_id(field_name), isRequired, get_admin_id(adminId), JSON.stringify(allowedFormats))
			});
		}
	}

	useEffect(() => {
		let rootMessages = getRootMessages(props.clientId, "file-upload");

		if (rootMessages) {
			const newMessages = clone(messages);

			assign(newMessages, rootMessages);

			props.setAttributes({ messages: newMessages });
		}
		setRootData();
	}, []);

	useEffect(() => {
		setRootData();
	}, [props])

	const setMessages = (type, m) => {
		let newMessages = clone(messages);

		set(newMessages, type, m);

		props.setAttributes({ messages: newMessages });
	};

	const suggestions = [
		"jpg",
		"jpeg",
		"png",
		"gif",
		"pdf",
		"doc",
		"docx",
		"ppt",
		"pptx",
		"odt",
		"avi",
		"ogg",
		"m4a",
		"mov",
		"mp3",
		"mp4",
		"mpg",
		"wav",
		"wmv"
	];

	const handleFormats = (newFormats) => {

		for (const format of newFormats) {
			if (!suggestions.includes(format)) {
				return;
			}
		}

		props.setAttributes({ allowedFormats: newFormats });
	}

	const handleAdminId = (id) => {
		props.setAttributes({
			adminId: {
				...adminId,
				value: id.replace(/\s|-/g, "_")
			}
		})
	}

	return [
		!!props.isSelected && (
			<InspectorControls>
				<PanelBody title={__("Field Settings", TEXT_DOMAIN)} initialOpen={true}>

					<div className="cwp-option">
						<TextControl
							placeholder={adminId.default}
							label={__("Field ID", TEXT_DOMAIN)}
							value={adminId.value}
							onChange={handleAdminId}
						/>
					</div>

					{!enableCondition ? (
						<PanelRow>
							<h3 className="cwp-heading">{__("Required", TEXT_DOMAIN)}</h3>
							<FormToggle
								label="Required"
								checked={isRequired}
								onChange={handleRequired}
							/>
						</PanelRow>
					) : (
							<div className="cwp-option">
								<p>
									<Icon icon="info" /> {__("You cannot set a conditional field required!", TEXT_DOMAIN)}
								</p>
							</div>
						)}
					{isRequired && (
						<Fragment>
							<div className="cwp-option">
								<h3 className="cwp-heading">{__("Required Text", TEXT_DOMAIN)}</h3>
								<TextControl
									onChange={label =>
										props.setAttributes({ requiredLabel: label })
									}
									value={requiredLabel}
								/>
							</div>
						</Fragment>
					)}
					<div className="cwp-option column">
						<h3>{__("Allowed Formats", TEXT_DOMAIN)}</h3>
						<div className="cwp-column">
							<FormTokenField
								value={allowedFormats}
								suggestions={suggestions}
								onChange={f => handleFormats(f)}
								placeholder="Allowed Format(s)"
							/>
						</div>
					</div>
				</PanelBody>
				<PanelBody title={__("Condition", TEXT_DOMAIN)}>
					<ConditionalLogic
						condition={condition}
						set={props.setAttributes}
						clientId={props.clientId}
						useCondition={props.attributes.enableCondition}
					/>
				</PanelBody>
				<PanelBody title={__("Messages", TEXT_DOMAIN)}>
					{isRequired && (
						<div className="cwp-option">
							<h3 className="cwp-heading">{__("Required Error", TEXT_DOMAIN)}</h3>
							<TextControl
								onChange={label => setMessages("empty", label)}
								value={empty}
							/>
						</div>
					)}
					<div className="cwp-option">
						<h3 className="cwp-heading">{__("Invalid File Error", TEXT_DOMAIN)}</h3>
						<TextControl
							onChange={v => setMessages("invalid", v)}
							value={invalid}
						/>
					</div>
					<div className="cwp-option">
						<p>
							<Icon icon="info" /> {__("Use {{value}} to insert field value!", TEXT_DOMAIN)}
						</p>
					</div>
				</PanelBody>
			</InspectorControls>
		),
		!!props.isSelected && <BlockControls></BlockControls>,
		<div className={`cwp-file cwp-field ${props.className}`}>
			{!!props.isSelected && !enableCondition && (
				<div className="cwp-required">
					<h3>{__("Required", TEXT_DOMAIN)}</h3>
					<FormToggle checked={isRequired} onChange={handleRequired} />
				</div>
			)}
			<div className="cwp-field-set">
				<div className="cwp-label-wrap">
					<RichText tag="label" value={label} onChange={handleLabel} />
					{!props.isSelected && isRequired && !enableCondition && (
						<div className="cwp-required cwp-noticed">
							<h3>{requiredLabel}</h3>
						</div>
					)}
				</div>
				<input type="file" disabled required={isRequired} />
			</div>
		</div>
	];
}

export default edit;
