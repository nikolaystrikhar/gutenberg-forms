import React, { useEffect } from "react";
import {
	FormToggle,
	Toolbar,
	PanelRow,
	PanelBody,
	ResizableBox,
	TextControl,
	Icon,
	RangeControl
} from "@wordpress/components";
import {
	getFieldName,
	extract_id,
	getEncodedData
} from "../../block/misc/helper";

import { clone, set, assign } from "lodash";
import { getRootMessages } from "../../block/functions/index";
import ConditionalLogic from "../../block/components/condition";

const { __ } = wp.i18n;

const {
	InspectorControls,
	BlockControls,
	BlockIcon,
	RichText
} = wp.blockEditor;

function edit(props) {
	const handleChange = e => {
		let message = e.target.value;

		props.setAttributes({ message });
	};

	const handleRequired = () => {
		const { isRequired } = props.attributes;

		props.setAttributes({ isRequired: !isRequired });
	};

	const handleLabel = label => {
		props.setAttributes({ label });
	};

	const {
		message,
		isRequired,
		label,
		id,
		height,
		field_name,
		requiredLabel,
		messages: { invalid, empty },
		messages,
		pattern,
		condition,
		enableCondition,
		minimumLength,
		maximumLength
	} = props.attributes;

	const getRootData = () => {
		if (field_name === "") {
			props.setAttributes({
				field_name: getFieldName("message", props.clientId)
			});
			props.setAttributes({
				id:
					props.clientId +
					"__" +
					getEncodedData("message", props.clientId, isRequired)
			});
		} else if (field_name !== "") {
			props.setAttributes({
				id:
					extract_id(field_name) +
					"__" +
					getEncodedData("message", extract_id(field_name), isRequired)
			});
		}
	}

	useEffect(() => {
		let rootMessages = getRootMessages(props.clientId, "message");

		if (rootMessages) {
			const newMessages = clone(messages);

			assign(newMessages, rootMessages);

			props.setAttributes({ messages: newMessages });
		}
		getRootData();
		
	}, []);

	useEffect(() => getRootData() , [props]);

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
							max={1000}
						/>
						<RangeControl
							label={__('Maximum Length')}
							value={maximumLength}
							onChange={value => props.setAttributes({ maximumLength: value })}
							min={1}
							max={1000}
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
		<div className={`cwp-message cwp-field ${props.className}`}>
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
				<ResizableBox
					size={{
						height,
						width: "100%"
					}}
					showHandle={true}
					minHeight="50"
					enable={{
						top: false,
						right: false,
						bottom: true,
						left: false,
						topRight: false,
						bottomRight: false,
						bottomLeft: false,
						topLeft: false
					}}
					onResizeStop={(event, direction, elt, delta) => {
						props.setAttributes({
							height: parseInt(height + delta.height, 10)
						});
					}}
				>
					<textarea
						value={message}
						style={{ height: height }}
						onChange={handleChange}
					/>
				</ResizableBox>
			</div>
		</div>
	];
}

export default edit;
