import React, { useState, useEffect } from "react";
import {
	FormToggle,
	Toolbar,
	PanelRow,
	PanelBody,
	Icon
} from "@wordpress/components";

const { InspectorControls, BlockControls, BlockIcon } = wp.blockEditor;

import { clone, pullAt } from "lodash";

const { RichText } = wp.blockEditor;

function edit(props) {
	let { options, isRequired, label } = props.attributes;

	const [radios, setRadios] = useState([]);

	useEffect(() => {
		let { options } = props.attributes;

		setRadios(options);
	}, []);

	const handleRequired = () => {
		const { isRequired } = props.attributes;

		props.setAttributes({ isRequired: !isRequired });
	};

	const addRadio = () => {
		let newOption = {
			label: "Radio " + (radios.length + 1),
			checked: false
		};

		let new_options = clone(radios);

		new_options.push(newOption);

		props.setAttributes({ options: new_options });
		setRadios(new_options);
	};

	const handleDelete = index => {
		let new_options = clone(options);

		let deleted_options = pullAt(new_options, [index]); //dosen't matter :-D

		props.setAttributes({ options: new_options });
		setRadios(new_options);
	};

	const handleLabel = label => {
		props.setAttributes({ label });
	};

	const handleChange = (e, index) => {
		let new_options = clone(options);

		new_options[index].label = e.target.value;

		setRadios(new_options);
		props.setAttributes({ options: new_options });
	};

	const handleCheck = (e, index) => {
		let new_options = clone(options);

		new_options.forEach(v => (v.checked = false));

		new_options[index].checked = e.target.checked;

		setRadios(new_options);
		props.setAttributes({ options: new_options });
	};

	return [
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
		</InspectorControls>,
		null,
		<div className="cwp-radios cwp-field">
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
			<div className="cwp-radios-set">
				<RichText tag="label" value={label} onChange={handleLabel} />
				{radios.map((radio, index) => {
					return (
						<div className="cwp-radios-option">
							<input
								checked={radio.checked}
								onClick={e => handleCheck(e, index)}
								type="radio"
							/>
							{!!props.isSelected ? (
								<input
									onChange={e => handleChange(e, index)}
									type="text"
									value={radio.label}
								/>
							) : (
								<label>{radio.label}</label>
							)}
							{!!props.isSelected && (
								<button onClick={() => handleDelete(index)}>
									<Icon icon="trash" />
								</button>
							)}
						</div>
					);
				})}
				{!!props.isSelected && (
					<div className="cwp-radios-controls">
						<button onClick={addRadio}>Add Option</button>
					</div>
				)}
			</div>
		</div>
	];
}

export default edit;
