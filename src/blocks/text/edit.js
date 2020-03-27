import React, { useEffect } from "react";
import {
	FormToggle,
	Toolbar,
	PanelRow,
	PanelBody,
	TextControl,
	RangeControl,
	Icon
} from "@wordpress/components";
import {
	getFieldName,
	extract_id,
	getEncodedData
} from "../../block/misc/helper";
import { set, clone, assign } from "lodash";
import { getRootMessages } from "../../block/functions/index";
import ConditionalLogic from "../../block/components/condition";

const {
	InspectorControls,
	BlockControls,
	BlockIcon,
	RichText
} = wp.blockEditor;

const { __ } = wp.i18n;

function edit(props) {
	const handleChange = e => {
		let text = e.target.value;

		props.setAttributes({ text });
	};

	const handleRequired = () => {
		const { isRequired } = props.attributes;

		props.setAttributes({ isRequired: !isRequired });
	};

	const handleLabel = label => {
		props.setAttributes({ label });
	};

	const {
		text,
		isRequired,
		label,
		id,
		field_name,
		requiredLabel,
		messages,
		messages: { invalid, empty },
		pattern,
		minimumLength,
		maximumLength,
		condition,
		enableCondition
	} = props.attributes;

	const getRootData = () => {
		if (field_name === "") {
			props.setAttributes({ field_name: getFieldName("text", props.clientId) });
			props.setAttributes({
				id:
					props.clientId +
					"__" +
					getEncodedData("text", props.clientId, isRequired)
			});
		} else if (field_name !== "") {
			props.setAttributes({
				id:
					extract_id(field_name) +
					"__" +
					getEncodedData("text", extract_id(field_name), isRequired)
			});
		}
	}

	useEffect(() => {
		let rootMessages = getRootMessages(props.clientId, "text");

		if (rootMessages) {
			const newMessages = clone(messages);

			assign(newMessages, rootMessages);

			props.setAttributes({ messages: newMessages });
		}

		getRootData();
	}, []);

	useEffect(() => getRootData(),  [props]);

	const setMessages = (type, m) => {
		let newMessages = clone(messages);

		set(newMessages, type, m);

		props.setAttributes({ messages: newMessages });
	};

	return [
		!!props.isSelected && (
			<InspectorControls>
				<PanelBody title="Field Settings" initialOpen={true}>
					{!enableCondition ? (
						<PanelRow>
							<h3 className="cwp-heading">Required</h3>
							<FormToggle
								label="Required"
								checked={isRequired}
								onChange={handleRequired}
							/>
						</PanelRow>
					) : (
							<div className="cwp-option">
								<p>
									<Icon icon="info" /> You cannot set a conditional field
								required!
							</p>
							</div>
						)}

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

					<div className="cwp-option">
						<RangeControl
							label={__('Minimum Length')}
							value={minimumLength}
							initialPosition={0}
							onChange={value => props.setAttributes({ minimumLength: value })}
							min={0}
							max={100}
						/>
						<RangeControl
							label={__('Maximum Length')}
							value={maximumLength}
							onChange={value => props.setAttributes({ maximumLength: value })}
							min={1}
							max={100}
						/>
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
				<PanelBody title="Messages">
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
				<PanelBody title="Validation">
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
		<div className={`cwp-text cwp-field ${props.className}`}>
			{!!props.isSelected && !enableCondition && (
				<div className="cwp-required">
					<h3>Required</h3>
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
				<input value={text} onChange={handleChange} />
			</div>
		</div>
	];
}

export default edit;
