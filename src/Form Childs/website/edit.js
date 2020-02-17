import React, { useEffect } from "react";
import {
	FormToggle,
	Toolbar,
	PanelRow,
	PanelBody,
	TextControl,
	Icon
} from "@wordpress/components";
import {
	getFieldName,
	extract_id,
	getEncodedData
} from "../../block/misc/helper";

import { set, clone } from "lodash";

const {
	InspectorControls,
	BlockControls,
	BlockIcon,
	RichText
} = wp.blockEditor;

function edit(props) {
	const handleChange = e => {
		let website = e.target.value;

		props.setAttributes({ website });
	};

	const handleRequired = () => {
		const { isRequired } = props.attributes;

		props.setAttributes({ isRequired: !isRequired });
	};

	const handleLabel = label => {
		props.setAttributes({ label });
	};

	const {
		website,
		isRequired,
		label,
		id,
		field_name,
		requiredLabel,
		messages: { invalid, empty },
		messages
	} = props.attributes;
	useEffect(() => {
		if (field_name === "") {
			props.setAttributes({
				field_name: getFieldName("website", props.clientId)
			});
			props.setAttributes({
				id:
					props.clientId +
					"__" +
					getEncodedData("website", props.clientId, isRequired)
			});
		} else if (field_name !== "") {
			props.setAttributes({
				id:
					extract_id(field_name) +
					"__" +
					getEncodedData("website", extract_id(field_name), isRequired)
			});
		}
	}, []);

	const setMessages = (type, m) => {
		let newMessages = clone(messages);

		set(newMessages, type, m);

		props.setAttributes({ messages: newMessages });
	};

	return [
		!!props.isSelected && (
			<InspectorControls>
				<PanelBody
					title="Field Settings"
					icon="admin-generic"
					initialOpen={true}
				>
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
				<PanelBody title="Messages" icon="email">
					{isRequired && (
						<div className="cwp-option">
							<h3 className="cwp-heading">Required Error</h3>
							<TextControl
								onChange={label => setMessages("empty", label)}
								value={empty}
							/>
						</div>
					)}
					<div className="cwp-option">
						<h3 className="cwp-heading">Invalid Message Error</h3>
						<TextControl
							onChange={v => setMessages("invalid", v)}
							value={invalid}
						/>
					</div>
					<div className="cwp-option">
						<p>
							<Icon icon="info" /> Use {"{{value}}"} to insert field value!
						</p>
					</div>
				</PanelBody>
			</InspectorControls>
		),
		!!props.isSelected && <BlockControls></BlockControls>,
		<div className={`cwp-website cwp-field ${props.className}`}>
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
				<input value={website} onChange={handleChange} />
			</div>
		</div>
	];
}

export default edit;
