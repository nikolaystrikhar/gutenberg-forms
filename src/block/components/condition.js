import { __ } from '@wordpress/i18n';
import React, { Fragment, useEffect } from "react";
import {
	SelectControl,
	TextControl,
	FormToggle,
	PanelRow,
} from "@wordpress/components";
import { getSiblings } from "../functions";
import { has, set, clone, isEmpty, get } from "lodash";

function Condition(props) {
	let currentField = props.fieldName,
		{ clientId, condition } = props; // where props.set === props.setAttributes

	useEffect(() => {
		let first_field = getOptions()[1];

		if (
			!isEmpty(first_field) &&
			has(first_field, "value") &&
			isEmpty(condition.value)
		) {
			handleConditionChange(first_field.value, "field");
		}
	}, []);

	const getOptions = () => {
		let fields = [
			{
				value: null,
				label: __("Select Field", 'forms-gutenberg'),
			},
		];

		// function getSiblings( clientId ) => return the relatives of the particular field inside a parent/root block

		getSiblings(clientId).forEach((sibling) => {
			if (!has(sibling, "label") && !has(sibling, "field_name")) return;
			const { label, field_name } = sibling; //destructuring the label attribute from the sibling field..

			fields.push({ value: field_name, label: label }); //pushing the option to the select field
			//where field_name is the unique id of the field;
		});

		return fields;
	};

	const handleConditionChange = (value, type) => {
		const newCondition = clone(condition); //creating a copy of the existing condition;

		set(newCondition, type, value); //modifying the condition copy;

		props.set({ condition: newCondition }); //props.setAttributes()
	};

	let operators = [
		{
			value: "===",
			label: __("Is Equal To", 'forms-gutenberg'),
		},
		{
			value: "!==",
			label: __("Not Equal To", 'forms-gutenberg'),
		},
	];

	const getValueType = () => {
		if (isEmpty(condition.field)) return null;

		const splitted_fieldName = condition.field.split("-"),
			fieldName = splitted_fieldName[0];

		const siblings = getSiblings(clientId);

		let currentSibling = siblings.filter(
				(v) => v.field_name === condition.field
			),
			selectOptions;

		if (
			fieldName === "select" ||
			fieldName === "radio" ||
			fieldName === "checkbox"
		) {
			if (has(currentSibling[0], "options")) {
				const generatedOptions = currentSibling[0].options.map((v) => {
					return {
						...v,
						value: v.label,
					};
				});

				generatedOptions.unshift({
					label: __( "Select Value", 'forms-gutenberg'),
					value: "",
				});

				selectOptions = generatedOptions;
			}
		}

		switch (fieldName) {
			case "radio":
				return (
					<SelectControl
						value={condition.value}
						onChange={(val) => {
							handleConditionChange(val, "value");
						}}
						options={selectOptions}
					/>
				);

			case "checkbox":
				return (
					<SelectControl
						multiple
						value={condition.value}
						onChange={(val) => {
							handleConditionChange(val, "value");
						}}
						options={selectOptions}
					/>
				);

			case "select":
				return (
					<SelectControl
						value={condition.value}
						onChange={(val) => {
							handleConditionChange(val, "value");
						}}
						options={selectOptions}
					/>
				);

			default: {
				return (
					<TextControl
						value={condition.value}
						placeholder={__("value", 'forms-gutenberg')}
						onChange={(val) => handleConditionChange(val, "value")}
					/>
				);
			}
		}
	};

	return (
		<div className="cwp-form-condition-component">
			<div className="cwp-option">
				<PanelRow>
					<h3>Use Condition</h3>
					<FormToggle
						checked={props.useCondition}
						onChange={() => {
							if (props.useCondition === false) {
								props.set({ isRequired: false });
							}
							props.set({
								enableCondition: !props.useCondition,
							});
						}}
					/>
				</PanelRow>
			</div>

			{props.useCondition && (
				<Fragment>
					<h3>Show if</h3>
					<SelectControl
						value={condition.field}
						options={getOptions()}
						onChange={(field) => {
							handleConditionChange(field, "field");
						}}
					/>
					<SelectControl
						onChange={(operator) => {
							handleConditionChange(operator, "condition");
						}}
						value={condition.condition}
						options={operators}
					/>
					{getValueType()}
				</Fragment>
			)}
		</div>
	);
}

export default Condition;
