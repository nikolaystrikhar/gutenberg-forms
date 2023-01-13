import React, { useEffect } from "react";
import {
	FormToggle,
	Toolbar,
	PanelRow,
	PanelBody,
	TextControl
} from "@wordpress/components";

import {
	getFieldName,
	extract_id,
	getEncodedData,
	extract_admin_id,
	get_admin_id
} from "../../block/misc/helper";
import { detect_similar_forms } from "../../block/functions";


const { __ } = wp.i18n;
const {
	InspectorControls,
	BlockControls,
	BlockIcon,
	RichText
} = wp.blockEditor;

function edit(props) {
	const handleChange = v => {
		let yes_no = v;

		props.setAttributes({ yes_no });
	};

	const handleRequired = () => {
		const { isRequired } = props.attributes;

		props.setAttributes({ isRequired: !isRequired });
	};

	const handleLabel = label => {
		props.setAttributes({ label });
	};

	const {
		yes_no,
		isRequired,
		label,
		id,
		field_name,
		requiredLabel,
		adminId
	} = props.attributes;

	const getRootData = () => {
		if (field_name === "" || detect_similar_forms(props.clientId)) {

			const newFieldName = getFieldName("yes_no", props.clientId)

			props.setAttributes({
				field_name: newFieldName,
				adminId: {
					value: extract_admin_id(newFieldName, 'yes_no'),
					default: extract_admin_id(newFieldName, 'yes_no')
				}
			});
			props.setAttributes({
				id:
					props.clientId +
					"__" +
					getEncodedData("yes_no", props.clientId, isRequired, get_admin_id(adminId))
			});
		} else if (field_name !== "") {
			props.setAttributes({
				id:
					extract_id(field_name) +
					"__" +
					getEncodedData("yes_no", extract_id(field_name), isRequired, get_admin_id(adminId))
			});
		}
	}

	useEffect(() => {
		getRootData();
	}, []);

	useEffect(() => getRootData(), [props]);

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
				<PanelBody title={__("Field Settings", "forms-gutenberg")} initialOpen={true}>

					<div className="cwp-option">
						<TextControl
							placeholder={adminId.default}
							label={__("Field ID", "forms-gutenberg")}
							value={adminId.value}
							onChange={handleAdminId}
						/>
					</div>

					<PanelRow>
						<h3 className="cwp-heading">{__("Required", "forms-gutenberg")}</h3>
						<FormToggle
							label="Required"
							checked={isRequired}
							onChange={handleRequired}
						/>
					</PanelRow>
					{isRequired && (
						<div className="cwp-option">
							<h3 className="cwp-heading">{__("Required Text", "forms-gutenberg")}</h3>
							<TextControl
								onChange={label =>
									props.setAttributes({ requiredLabel: label })
								}
								value={requiredLabel}
							/>
						</div>
					)}
				</PanelBody>
			</InspectorControls>
		),
		null,
		<div className={`cwp-yes-no cwp-field cwp-misc-field ${props.className}`}>
			<div className="cwp-field-set">
				<div className="cwp-label-wrap">
					<RichText placeholder={__("Add a label", "forms-gutenberg")} tag="label" value={label} onChange={handleLabel} />
					{!props.isSelected && isRequired && (
						<div className="cwp-required cwp-noticed">
							<h3>{requiredLabel}</h3>
						</div>
					)}
				</div>

				<label className="cwp-switch">
					<input
						type="checkbox"
						checked={yes_no}
						onChange={() => handleChange(!yes_no)}
					/>
					<span className="cwp-slider"></span>
				</label>
			</div>
		</div>
	];
}

export default edit;
