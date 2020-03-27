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
	getEncodedData
} from "../../block/misc/helper";

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
		requiredLabel
	} = props.attributes;

	const getRootData = () => {
		if (field_name === "") {
			props.setAttributes({
				field_name: getFieldName("yes_no", props.clientId)
			});
			props.setAttributes({
				id:
					props.clientId +
					"__" +
					getEncodedData("yes_no", props.clientId, isRequired)
			});
		} else if (field_name !== "") {
			props.setAttributes({
				id:
					extract_id(field_name) +
					"__" +
					getEncodedData("yes_no", extract_id(field_name), isRequired)
			});
		}
	}

	useEffect(() => {
		getRootData();
	}, []);

	useEffect(() => getRootData(), [props]);

	return [
		!!props.isSelected && (
			<InspectorControls>
				<PanelBody title="Field Settings" initialOpen={true}>
					<PanelRow>
						<h3 className="cwp-heading">Required</h3>
						<FormToggle
							label="Required"
							checked={isRequired}
							onChange={handleRequired}
						/>
					</PanelRow>
					{isRequired && (
						<div className="cwp-option">
							<h3 className="cwp-heading">Required Text</h3>
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
			{!!props.isSelected && (
				<div className="cwp-required">
					<h3>Required</h3>
					<FormToggle checked={isRequired} onChange={handleRequired} />
				</div>
			)}

			<div className="cwp-field-set">
				<div className="cwp-label-wrap">
					<RichText tag="label" value={label} onChange={handleLabel} />
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
