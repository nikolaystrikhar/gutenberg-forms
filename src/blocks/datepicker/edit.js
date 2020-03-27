import React, { useEffect } from "react";
import {
	FormToggle,
	Toolbar,
	PanelRow,
	PanelBody,
	TextControl,
	SelectControl
} from "@wordpress/components";
import {
	getFieldName,
	extract_id,
	getEncodedData
} from "../../block/misc/helper";
import DatePicker from "../../block/components/datepicker";
import { clone, set } from "lodash";
import ConditionalLogic from "../../block/components/condition";

const {
	InspectorControls,
	BlockControls,
	BlockIcon,
	RichText
} = wp.blockEditor;

function edit(props) {
	const handleChange = e => {
		let placeholder = e.target.value;

		props.setAttributes({ placeholder });
	};

	const handleRequired = () => {
		const { isRequired } = props.attributes;

		props.setAttributes({ isRequired: !isRequired });
	};

	const handleLabel = label => {
		props.setAttributes({ label });
	};
	const inputField = React.useRef();

	const {
		placeholder,
		isRequired,
		label,
		id,
		field_name,
		requiredLabel,
		type,
		messages: { empty },
		messages,
		format,
		condition,
		enableCondition
	} = props.attributes;

	const getRootData = () => {
		if (field_name === "") {
			props.setAttributes({
				field_name: getFieldName("datePicker", props.clientId)
			});
			props.setAttributes({
				id:
					props.clientId +
					"__" +
					getEncodedData("datePicker", props.clientId, isRequired)
			});
		} else if (field_name !== "") {
			props.setAttributes({
				id:
					extract_id(field_name) +
					"__" +
					getEncodedData("datePicker", extract_id(field_name), isRequired)
			});
		}
	}

	useEffect(() => {
		getRootData();
	}, []);

	useEffect(() => getRootData() , [props]);

	const getTypeActive = t => {
		if (type === t) {
			return {
				isDefault: true
			};
		}

		return {
			isPrimary: true
		};
	};

	let getFieldType = () => {
		switch (type) {
			case "both":
				return "datetime-local";
			case "time":
				return "time";
			case "date":
				return "date";
		}
	};

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
						<SelectControl
							label="Format"
							value={format}
							options={[
								{ label: "Day Month Year", value: "DD/MM/YYYY" },
								{ label: "Month Day Year", value: "MM/DD/YYYY" },
								{ label: "Year Month Day", value: "YYYY/MM/DD" }
							]}
							onChange={format => {
								props.setAttributes({ format });
							}}
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
				{isRequired && (
					<PanelBody title="Messages">
						<div className="cwp-option">
							<h3 className="cwp-heading">Required Error</h3>
							<TextControl
								onChange={label => setMessages("empty", label)}
								value={empty}
							/>
						</div>
					</PanelBody>
				)}
			</InspectorControls>
		),
		!!props.isSelected && <BlockControls></BlockControls>,
		<div className={`cwp-field cwp-datepicker ${props.className}`}>
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
				{format === "DD/MM/YYYY" && (
					<DatePicker
						format={format}
						value={placeholder}
						onChange={handleChange}
						setAttributes={props.setAttributes}
					/>
				)}
				{format === "MM/DD/YYYY" && (
					<DatePicker
						format={format}
						value={placeholder}
						onChange={handleChange}
						setAttributes={props.setAttributes}
					/>
				)}
				{format === "YYYY/MM/DD" && (
					<DatePicker
						setAttributes={props.setAttributes}
						format={format}
						value={placeholder}
						onChange={handleChange}
					/>
				)}
			</div>
		</div>
	];
}

export default edit;
