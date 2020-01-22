import React, { useEffect } from "react";
import {
	FormToggle,
	Toolbar,
	PanelRow,
	PanelBody
} from "@wordpress/components";

import { getFieldName } from "../../block/misc/helper";

const {
	InspectorControls,
	BlockControls,
	BlockIcon,
	RichText
} = wp.blockEditor;

function edit(props) {
	const handleChange = e => {
		let email = e.target.value;

		props.setAttributes({ email });
	};

	const handleRequired = () => {
		const { isRequired } = props.attributes;

		props.setAttributes({ isRequired: !isRequired });
	};

	const handleLabel = label => {
		props.setAttributes({ label });
	};

	const { email, isRequired, label, id } = props.attributes;

	useEffect(() => {
		const encoded_data = encodeURIComponent(
			window.btoa(
				`--${getFieldName("email", props.clientId)}-${isRequired}-email`
			)
		);
		props.setAttributes({ field_name: getFieldName("email", props.clientId) });
		props.setAttributes({ id: props.clientId + encoded_data });
	}, []);

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
				</PanelBody>
			</InspectorControls>
		),
		!!props.isSelected && <BlockControls></BlockControls>,
		<div className="cwp-email cwp-field">
			{!!props.isSelected && (
				<div className="cwp-required">
					<h3>Required</h3>
					<FormToggle checked={isRequired} onChange={handleRequired} />
				</div>
			)}
			{!props.isSelected && isRequired && (
				<div className="cwp-required cwp-noticed">
					<h3>Required</h3>
				</div>
			)}
			<div className="cwp-field-set">
				<RichText tag="label" value={label} onChange={handleLabel} />
				<input value={email} onChange={handleChange} />
			</div>
		</div>
	];
}

export default edit;
