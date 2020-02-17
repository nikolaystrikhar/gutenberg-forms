import React, { useEffect, Fragment } from "react";
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

import { clone, set } from "lodash";

const {
	InspectorControls,
	BlockControls,
	BlockIcon,
	RichText
} = wp.blockEditor;

function edit(props) {
	const handleChange = e => {
		let name = e.target.value;

		props.setAttributes({ name });
	};

	const handleRequired = () => {
		const { isRequired } = props.attributes;

		props.setAttributes({ isRequired: !isRequired });
	};

	const handleLabel = label => {
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
		pattern
	} = props.attributes;

	useEffect(() => {
		if (field_name === "") {
			props.setAttributes({ field_name: getFieldName("name", props.clientId) });
			props.setAttributes({
				id:
					props.clientId +
					"__" +
					getEncodedData("name", props.clientId, isRequired)
			});
		} else if (field_name !== "") {
			props.setAttributes({
				id:
					extract_id(field_name) +
					"__" +
					getEncodedData("name", extract_id(field_name), isRequired)
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
						<Fragment>
							<div className="cwp-option">
								<h3 className="cwp-heading">Required Text</h3>
								<TextControl
									onChange={label =>
										props.setAttributes({ requiredLabel: label })
									}
									value={requiredLabel}
								/>
							</div>
						</Fragment>
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
						<h3 className="cwp-heading">Invalid Name Error</h3>
						<TextControl
							onChange={v => setMessages("invalidName", v)}
							value={invalidName}
						/>
					</div>
					<div className="cwp-option">
						<p>
							<Icon icon="info" /> Use {"{{value}}"} to insert field value!
						</p>
					</div>
				</PanelBody>
				<PanelBody title="Validation" icon="lock">
					<div className="cwp-option">
						<TextControl
							label="Pattern (RegExp)"
							onChange={pattern => props.setAttributes({ pattern })}
							value={pattern}
						/>
					</div>
				</PanelBody>
			</InspectorControls>
		),
		!!props.isSelected && <BlockControls></BlockControls>,
		<div className={`cwp-name cwp-field ${props.className}`}>
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
				<input value={name} onChange={handleChange} />
			</div>
		</div>
	];
}

export default edit;
