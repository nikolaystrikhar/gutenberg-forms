import React, { useEffect, Fragment } from "react";
import {
	FormToggle,
	PanelRow,
	PanelBody,
	RangeControl,
	Icon,
	TextControl
} from "@wordpress/components";
import {
	getFieldName,
	extract_id,
	getEncodedData
} from "../../block/misc/helper";

import { clone, set, assign } from "lodash";
import { getRootMessages, detectSimilarFields } from "../../block/functions";

const {
	InspectorControls,
	BlockControls,
	BlockIcon,
	RichText
} = wp.blockEditor;

function edit(props) {
	const handleChange = e => {
		let number = e.target.value;

		props.setAttributes({ number });
	};

	const handleRequired = () => {
		const { isRequired } = props.attributes;

		props.setAttributes({ isRequired: !isRequired });
	};

	const handleLabel = label => {
		props.setAttributes({ label });
	};

	const {
		number,
		isRequired,
		label,
		id,
		field_name,
		isRange,
		rangeMax,
		rangeMin,
		requiredLabel,
		messages: { invalid, empty },
		messages,
		steps
	} = props.attributes;

	const getRootData = () => {
		if (field_name === "" || detectSimilarFields(props.clientId, field_name)) {
			props.setAttributes({
				field_name: getFieldName("number", props.clientId)
			});
			props.setAttributes({
				id:
					props.clientId +
					"__" +
					getEncodedData("number", props.clientId, isRequired)
			});
		} else if (
			field_name !== "" &&
			detectSimilarFields(props.clientId, field_name)
		) {
			props.setAttributes({
				id:
					extract_id(field_name) +
					"__" +
					getEncodedData("number", extract_id(field_name), isRequired)
			});
		}
	}

	useEffect(() => {
		let rootMessages = getRootMessages(props.clientId, "number");

		if (rootMessages) {
			const newMessages = clone(messages);

			assign(newMessages, rootMessages);

			props.setAttributes({ messages: newMessages });
		}

		getRootData();
	}, []);

	useEffect(() => getRootData()  , [props]);

	const setMessages = (type, m) => {
		let newMessages = clone(messages);

		set(newMessages, type, m);

		props.setAttributes({ messages: newMessages });
	};

	return [
		!!props.isSelected && (
			<InspectorControls>
				<PanelBody title="Field Settings" initialOpen={true}>
					<div className="cwp-option">
						<PanelRow>
							<h3 className="cwp-heading">Required</h3>
							<FormToggle
								label="Required"
								checked={isRequired}
								onChange={handleRequired}
							/>
						</PanelRow>
					</div>
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
					<RangeControl
						min={0}
						max={10000}
						value={steps}
						step={0.1}
						onChange={steps => props.setAttributes({ steps })}
						label="Steps"
					/>
					<div className="cwp-option">
						<RangeControl
							min={0}
							max={10000}
							value={rangeMax}
							onChange={m => props.setAttributes({ rangeMax: m })}
							label="Range Max"
						/>
						<RangeControl
							min={0}
							value={rangeMin}
							max={10000}
							onChange={m => props.setAttributes({ rangeMin: m })}
							label="Range Min"
						/>
					</div>
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
						<h3 className="cwp-heading">Invalid Number Error</h3>
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
		<div className={`cwp-number cwp-field ${props.className}`}>
			{!!props.isSelected && (
				<div className="cwp-required">
					<h3>Range Slider</h3>
					<FormToggle
						checked={isRange}
						onChange={() => props.setAttributes({ isRange: !isRange })}
					/>
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
				{isRange ? (
					<div className="cwp-range-set">
						<input
							value={number}
							max={rangeMax}
							min={rangeMin}
							type="range"
							step={steps}
							onChange={handleChange}
						/>
						<input
							value={number}
							step={steps}
							type="number"
							max={rangeMax}
							min={rangeMin}
							onChange={handleChange}
						/>
					</div>
				) : (
					<input
						value={number}
						max={rangeMax}
						step={steps}
						min={rangeMin}
						type="number"
						onChange={handleChange}
					/>
				)}
			</div>
		</div>
	];
}

export default edit;
