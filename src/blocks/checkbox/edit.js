import React, { useState, useEffect, Fragment, useRef } from "react";
import {
	FormToggle,
	Toolbar,
	PanelRow,
	PanelBody,
	Icon,
	Button,
	TextControl,
	SelectControl
} from "@wordpress/components";

const { InspectorControls, BlockControls, BlockIcon } = wp.blockEditor;

import { clone, pullAt, has, set } from "lodash";
import ImageUpload from "../../block/components/imageUpload";
import ImagePreview from "../../block/components/imagePreview";
import ConditionalLogic from "../../block/components/condition";

import {
	getFieldName,
	extract_id,
	getEncodedData
} from "../../block/misc/helper";

const { RichText } = wp.blockEditor;

function edit(props) {
	let {
		options,
		isRequired,
		label,
		id,
		field_name,
		requiredLabel,
		messages,
		messages: { empty },
		condition,
		enableCondition,
		fieldStyle
	} = props.attributes;

	const [checkboxes, setCheckboxes] = useState([]);
	const [focus, setFocus] = useState({
		f: false,
		index: null
	});

	let checkboxContainer = useRef();

	const getRootData = () => {
		if (field_name === "") {
			props.setAttributes({
				field_name: getFieldName("checkbox", props.clientId)
			});
			props.setAttributes({
				id:
					props.clientId +
					"__" +
					getEncodedData("checkbox", props.clientId, isRequired) +
					"[]"
			});
		} else if (field_name !== "") {
			props.setAttributes({
				id:
					extract_id(field_name) +
					"__" +
					getEncodedData("checkbox", extract_id(field_name), isRequired) +
					"[]"
			});
		}
	}

	useEffect(() => {
		let { options } = props.attributes;

		setCheckboxes(options);
		getRootData()
		
	}, []);

	useEffect(() => getRootData() , [props]);

	const setMessages = (type, m) => {
		let newMessages = clone(messages);

		set(newMessages, type, m);

		props.setAttributes({ messages: newMessages });
	};

	useEffect(() => {
		let boxes = checkboxContainer.current.querySelectorAll(
			'.cwp-checkbox-option input[type="text"]'
		);

		if (focus.f) {
			if (focus.index === null) {
				boxes[boxes.length - 1].focus();
			} else {
				boxes[focus.index].focus();
			}

			setFocus({ f: false, index: null });
		}
	}, [checkboxes, focus]); //subscribing to any further changes...

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

		new_options[index] = {
			...new_options[index],
			label: e.target.value
		};

		setCheckboxes(new_options);
		props.setAttributes({ options: new_options });
	};

	const handleCheck = (v, index) => {
		let new_options = clone(options);

		new_options[index].checked = v;
		setCheckboxes(new_options);
		props.setAttributes({ options: new_options });
	};

	const handleImage = (img, index, action) => {
		let new_options = clone(options);

		if (action === "add") {
			new_options[index] = {
				...new_options[index],
				image: img
			};
		}

		if (action === "remove") {
			const checkboxToRemove = new_options[index];
			new_options[index] = {
				label: checkboxToRemove.label
			};
		}

		setCheckboxes(new_options);
		props.setAttributes({ options: new_options });
	};

	let handleDuplicate = index => {
		let new_options = clone(options);

		new_options.splice(index, 0, new_options[index]);

		setCheckboxes(new_options);
		props.setAttributes({ options: new_options });
	};

	let handleEnter = index => {
		let new_options = clone(options);

		new_options.splice(index + 1, 0, { label: "" });

		setCheckboxes(new_options);
		props.setAttributes({ options: new_options });
		setFocus({ f: true, index: index + 1 });
	};

	let handleBackspace = index => {
		if (checkboxes[index].label === "") {
			handleDelete(index);

			if (checkboxes[index - 1]) {
				setFocus({ f: true, index: index - 1 });
			}
		}
	};

	return [
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
							<Icon icon="info" /> You cannot set a conditional field required!
						</p>
					</div>
				)}
				{isRequired && (
					<div className="cwp-option">
						<h3 className="cwp-heading">Required Text</h3>
						<TextControl
							onChange={label => props.setAttributes({ requiredLabel: label })}
							value={requiredLabel}
						/>
					</div>
				)}
				<div className="cwp-option">
					<SelectControl
						label="Layout"
						value={fieldStyle}
						options={[
							{ label: "Block", value: "block" },
							{ label: "Inline", value: "inline" }
						]}
						onChange={s => {
							props.setAttributes({ fieldStyle: s });
						}}
					/>
				</div>
			</PanelBody>
			{isRequired && (
				<PanelBody title="Messages">
					<div className="cwp-option">
						<h3 className="cwp-heading">Required Error</h3>
						<TextControl
							onChange={label => setMessages("empty", label)}
							value={messages.empty}
						/>
					</div>
				</PanelBody>
			)}
			<PanelBody title="Condition">
				<ConditionalLogic
					condition={condition}
					set={props.setAttributes}
					clientId={props.clientId}
					useCondition={props.attributes.enableCondition}
				/>
			</PanelBody>
		</InspectorControls>,
		null,
		<div
			className={`cwp-checkbox cwp-field ${props.className} is-style-${fieldStyle}`}
		>
			{!!props.isSelected && !enableCondition && (
				<div className="cwp-required">
					<h3>Required</h3>
					<FormToggle checked={isRequired} onChange={handleRequired} />
				</div>
			)}

			<div
				ref={checkboxContainer}
				className={`cwp-checkbox-set-backend cwp-checkbox-set ${
					!props.isSelected ? "cwp-checkbox-set-preview" : ""
				}`}
			>
				<div className="cwp-label-wrap">
					<RichText tag="label" value={label} onChange={handleLabel} />

					{!props.isSelected && isRequired && !enableCondition && (
						<div className="cwp-required cwp-noticed">
							<h3>{requiredLabel}</h3>
						</div>
					)}
				</div>
				{checkboxes.map((checkbox, index) => {
					const hasImage = has(checkbox, "image"),
						image = hasImage ? checkbox.image.url : "";

					return (
						<Fragment>
							<div className="cwp-checkbox-option">
								<input
									id={id.concat(index.toString())}
									checked={checkbox.checked}
									type="checkbox"
									onClick={() => handleCheck(!checkbox.checked, index)}
								/>
								{!!props.isSelected && (
									<label
										style={{ width: "auto" }}
										for={id.concat(index.toString())}
										onClick={() => handleCheck(!checkbox.checked, index)}
									></label>
								)}
								{!!props.isSelected ? (
									<input
										onChange={e => handleChange(e, index)}
										onKeyDown={e => {
											e.key === "Enter" && handleEnter(index);
											e.key === "Backspace" && handleBackspace(index);
										}}
										type="text"
										value={checkbox.label}
									/>
								) : (
									<label>
										{checkbox.label}{" "}
										{hasImage && (
											<ImagePreview
												onEdit={img => handleImage(img, index, "add")}
												onRemove={() => handleImage(null, index, "remove")}
												isSelected={props.isSelected}
												image={checkbox.image}
											/>
										)}
									</label>
								)}
								{!!props.isSelected && (
									<Fragment>
										<ImageUpload
											icon="format-image"
											value={image}
											onSelect={img => handleImage(img, index, "add")}
										/>
										<Button isDefault onClick={() => handleDuplicate(index)}>
											<Icon icon="admin-page" />
										</Button>
										<Button isDefault onClick={() => handleDelete(index)}>
											<Icon icon="no-alt" />
										</Button>
									</Fragment>
								)}
							</div>
							{hasImage && props.isSelected && (
								<ImagePreview
									onEdit={img => handleImage(img, index, "add")}
									onRemove={() => handleImage(null, index, "remove")}
									isSelected={props.isSelected}
									image={checkbox.image}
								/>
							)}
						</Fragment>
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
