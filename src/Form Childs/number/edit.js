import React, { useEffect } from "react";
import {
	FormToggle,
	Toolbar,
	PanelRow,
	PanelBody,
	RangeControl,
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
		requiredLabel
	} = props.attributes;
	useEffect(() => {
		if (field_name === "") {
			props.setAttributes({
				field_name: getFieldName("number", props.clientId)
			});
			props.setAttributes({
				id:
					props.clientId +
					"__" +
					getEncodedData("number", props.clientId, isRequired)
			});
		} else if (field_name !== "") {
			props.setAttributes({
				id:
					extract_id(field_name) +
					"__" +
					getEncodedData("number", extract_id(field_name), isRequired)
			});
		}
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
				<PanelBody title="Range Setting" icon="admin-settings">
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
			{!props.isSelected && isRequired && (
				<div className="cwp-required cwp-noticed">
					<h3>Required</h3>
				</div>
			)}
			<div className="cwp-field-set">
				<RichText tag="label" value={label} onChange={handleLabel} />
				{isRange ? (
					<input
						value={number}
						max={rangeMax}
						min={rangeMin}
						type="range"
						onChange={handleChange}
					/>
				) : (
					<input
						value={number}
						max={rangeMax}
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
