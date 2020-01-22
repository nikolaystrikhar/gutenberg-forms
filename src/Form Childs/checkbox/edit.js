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
import { getFieldName } from '../../block/misc/helper';

const { RichText } = wp.blockEditor;

function edit(props) {
	let { options, isRequired, label, id } = props.attributes;

	const [checkboxes, setCheckboxes] = useState([]);

	useEffect(() => {
		let { options } = props.attributes;

		setCheckboxes(options);

		props.setAttributes({ field_name: getFieldName('checkbox' , props.clientId)  })

	}, []);

	const handleRequired = () => {
		const { isRequired } = props.attributes;

		props.setAttributes({ isRequired: !isRequired });
	};

	const addCheckbox = () => {
		let newOption = {
			label: "Option " + (checkboxes.length + 1),
			checked: false
		};

		let new_options = clone(checkboxes);

		new_options.push(newOption);

		props.setAttributes({ options: new_options });
		setCheckboxes(new_options);
	};

	const handleDelete = index => {
		let new_options = clone(options);

		let deleted_options = pullAt(new_options, [index]); //dosen't matter :-D

		props.setAttributes({ options: new_options });
		setCheckboxes(new_options);
	};

	const handleLabel = label => {
		props.setAttributes({ label });
	};

	const handleChange = (e, index) => {
		let new_options = clone(options);

		new_options[index].label = e.target.value;

		setCheckboxes(new_options);
		props.setAttributes({ options: new_options });
	};

	const handleCheck = (e, index) => {
		let new_options = clone(options);

		new_options[index].checked = e.target.checked;
		setCheckboxes(new_options);
		props.setAttributes({ options: new_options });
	};

	useEffect(() => {
		const encoded_data = encodeURIComponent(
			window.btoa(`-${isRequired}-checkbox`)
		);

		props.setAttributes({ id: props.clientId + encoded_data });
	}, []);

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
		<div className="cwp-checkbox cwp-field">
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
			<div className="cwp-checkbox-set">
				<RichText tag="label" value={label} onChange={handleLabel} />
				{checkboxes.map((checkbox, index) => {
					return (
						<div className="cwp-checkbox-option">
							<input
								checked={checkbox.checked}
								onClick={e => handleCheck(e, index)}
								type="checkbox"
							/>
							{!!props.isSelected ? (
								<input
									onChange={e => handleChange(e, index)}
									type="text"
									value={checkbox.label}
								/>
							) : (
								<label>{checkbox.label}</label>
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
					<div className="cwp-checkbox-controls">
						<button onClick={addCheckbox}>Add Option</button>
					</div>
				)}
			</div>
		</div>
	];
}

export default edit;
