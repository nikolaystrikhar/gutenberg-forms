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
import {
	getFieldName,
	extract_id,
	getEncodedData
} from "../../block/misc/helper";
import ImageUpload from "../../block/components/imageUpload";
import ImagePreview from "../../block/components/imagePreview";
import ConditionalLogic from "../../block/components/condition";

const { InspectorControls, BlockControls, BlockIcon } = wp.blockEditor;

import { clone, pullAt, isEqual, has, set, assign } from "lodash";
import { getRootMessages } from "../../block/functions/index";

const { RichText } = wp.blockEditor;

function edit(props) {
	let {
		options,
		isRequired,
		label,
		id,
		field_name,
		requiredLabel,
		messages: { empty },
		messages,
		condition,
		enableCondition,
		fieldStyle
	} = props.attributes;

	const radiosContainer = useRef();

	const [radios, setRadios] = useState([]);

	const [focus, setFocus] = useState({
		f: false,
		index: null
	});

	const getRootData = () => {
		if (field_name === "") {
			props.setAttributes({
				field_name: getFieldName("radio", props.clientId)
			});
			props.setAttributes({
				id:
					props.clientId +
					"__" +
					getEncodedData("radio", props.clientId, isRequired)
			});
		} else if (field_name !== "") {
			props.setAttributes({
				id:
					extract_id(field_name) +
					"__" +
					getEncodedData("radio", extract_id(field_name), isRequired)
			});
		}
	}

	useEffect(() => {
		let rootMessages = getRootMessages(props.clientId, "radio");

		if (rootMessages) {
			const newMessages = clone(messages);

			assign(newMessages, rootMessages);

			props.setAttributes({ messages: newMessages });
		}

		let { options } = props.attributes;

		const checked = options.find(c => c.checked);

		if (checked) {
			let opt = clone(options);

			let remove_extra_checked = opt.map(v => {
				if (!isEqual(v, checked)) {
					return {
						...v,
						checked: false
					};
				} else return v;
			});
			setRadios(remove_extra_checked);
		} else {
			setRadios(options);
		}

		getRootData();
	}, []);

	useEffect(() => getRootData() , [props]);

	useEffect(() => {
		let boxes = radiosContainer.current.querySelectorAll(
			'.cwp-radios-option input[type="text"]'
		);

		if (focus.f) {
			if (focus.index === null) {
				boxes[boxes.length - 1].focus();
			} else {
				boxes[focus.index].focus();
			}

			setFocus({ f: false, index: null });
		}
	}, [radios, focus]); //subscribing to any further changes...

	const handleRequired = () => {
		const { isRequired } = props.attributes;

		props.setAttributes({ isRequired: !isRequired });
	};

	const addRadio = () => {
		let newOption = {
			label: "Option " + (radios.length + 1),
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

		new_options[index] = {
			...new_options[index],
			label: e.target.value
		};

		setRadios(new_options);
		props.setAttributes({ options: new_options });
	};

	const handleCheck = (c, index) => {
		let new_options = clone(options);

		new_options.forEach(v => (v.checked = false));

		new_options[index].checked = c;

		setRadios(new_options);
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
			const RadioToRemove = new_options[index];
			new_options[index] = {
				label: RadioToRemove.label
			};
		}

		setRadios(new_options);
		props.setAttributes({ options: new_options });
	};

	let handleDuplicate = index => {
		let new_options = clone(options);

		new_options.splice(index, 0, new_options[index]);

		setRadios(new_options);
		props.setAttributes({ options: new_options });
	};

	let handleEnter = index => {
		let new_options = clone(options);

		new_options.splice(index + 1, 0, { label: "" });

		setRadios(new_options);
		props.setAttributes({ options: new_options });
		setFocus({ f: true, index: index + 1 });
	};

	let handleBackspace = index => {
		if (radios[index].label === "") {
			handleDelete(index);

			if (radios[index - 1]) {
				setFocus({ f: true, index: index - 1 });
			}
		}
	};

	const setMessages = (type, m) => {
		let newMessages = clone(messages);

		set(newMessages, type, m);

		props.setAttributes({ messages: newMessages });
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
		</InspectorControls>,
		null,
		<div
			className={`cwp-radios cwp-field ${props.className} is-style-${fieldStyle}`}
		>
			{!!props.isSelected && !enableCondition && (
				<div className="cwp-required">
					<h3>Required</h3>
					<FormToggle checked={isRequired} onChange={handleRequired} />
				</div>
			)}

			<div
				ref={radiosContainer}
				className={`cwp-radios-set ${
					!props.isSelected ? "cwp-radio-set-preview" : ""
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
				{radios.map((radio, index) => {
					const hasImage = has(radio, "image"),
						image = hasImage ? radio.image.url : "";

					return (
						<Fragment>
							<div className="cwp-radios-option">
								<input
									id={id.concat(index.toString())}
									checked={radio.checked}
									onClick={() => handleCheck(!radio.checked, index)}
									type="radio"
								/>
								{!!props.isSelected && (
									<label
										style={{ width: "auto" }}
										onClick={() => handleCheck(!radio.checked, index)}
										for={id.concat(index.toString())}
									></label>
								)}
								{!!props.isSelected ? (
									<input
										onKeyDown={e => {
											e.key === "Enter" && handleEnter(index);
											e.key === "Backspace" && handleBackspace(index);
										}}
										onChange={e => handleChange(e, index)}
										type="text"
										value={radio.label}
									/>
								) : (
									<label>
										{radio.label}{" "}
										{hasImage && !props.isSelected && (
											<ImagePreview
												onEdit={img => handleImage(img, index, "add")}
												onRemove={() => handleImage(null, index, "remove")}
												isSelected={props.isSelected}
												image={radio.image}
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
							{hasImage && !!props.isSelected && (
								<ImagePreview
									onEdit={img => handleImage(img, index, "add")}
									onRemove={() => handleImage(null, index, "remove")}
									isSelected={props.isSelected}
									image={radio.image}
								/>
							)}
						</Fragment>
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
