import React, { useState, useEffect, Fragment, useRef } from "react";
import {
	FormToggle,
	Toolbar,
	PanelRow,
	PanelBody,
	Icon,
	Button,
	TextControl,
	SelectControl,
} from "@wordpress/components";
import {
	getFieldName,
	extract_id,
	getEncodedData,
	extract_admin_id,
	get_admin_id,
} from "../../block/misc/helper";
import ImageUpload from "../../block/components/imageUpload";
import ImagePreview from "../../block/components/imagePreview";
import ConditionalLogic from "../../block/components/condition";
import Bulk_Add from "../components/bulk_add";

import { clone, pullAt, isEqual, has, set, assign } from "lodash";
import {
	getRootMessages,
	detect_similar_forms,
} from "../../block/functions/index";

const { RichText } = wp.blockEditor;
const { __ } = wp.i18n;
const { InspectorControls, BlockControls, BlockIcon } = wp.blockEditor;

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
		fieldStyle,
		bulkAdd,
		adminId,
		hint,
		showHint,
	} = props.attributes;

	const radiosContainer = useRef();

	const [radios, setRadios] = useState([]);

	const [focus, setFocus] = useState({
		f: false,
		index: null,
	});

	const getRootData = () => {
		if (field_name === "" || detect_similar_forms(props.clientId)) {
			const newFieldName = getFieldName("radio", props.clientId);

			props.setAttributes({
				field_name: newFieldName,
				adminId: {
					value: extract_admin_id(newFieldName, "radio"),
					default: extract_admin_id(newFieldName, "radio"),
				},
			});
			props.setAttributes({
				id:
					props.clientId +
					"__" +
					getEncodedData(
						"radio",
						props.clientId,
						isRequired,
						get_admin_id(adminId)
					),
			});
		} else if (field_name !== "") {
			props.setAttributes({
				id:
					extract_id(field_name) +
					"__" +
					getEncodedData(
						"radio",
						extract_id(field_name),
						isRequired,
						get_admin_id(adminId)
					),
			});
		}
	};

	useEffect(() => {
		let rootMessages = getRootMessages(props.clientId, "radio");

		if (rootMessages) {
			const newMessages = clone(messages);

			assign(newMessages, rootMessages);

			props.setAttributes({ messages: newMessages });
		}

		let { options } = props.attributes;

		const checked = options.find((c) => c.checked);

		if (checked) {
			let opt = clone(options);

			let remove_extra_checked = opt.map((v) => {
				if (!isEqual(v, checked)) {
					return {
						...v,
						checked: false,
					};
				} else return v;
			});
			setRadios(remove_extra_checked);
		} else {
			setRadios(options);
		}

		getRootData();
	}, []);

	useEffect(() => getRootData(), [props]);

	useEffect(() => {
		if (bulkAdd) return;

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
			checked: false,
		};

		let new_options = clone(radios);

		new_options.push(newOption);

		props.setAttributes({ options: new_options });
		setRadios(new_options);
	};

	const handleDelete = (index) => {
		let new_options = clone(options);

		let deleted_options = pullAt(new_options, [index]); //dosen't matter :-D

		props.setAttributes({ options: new_options });
		setRadios(new_options);
	};

	const handleLabel = (label) => {
		props.setAttributes({ label });
	};

	const handleChange = (e, index) => {
		let new_options = clone(options);

		new_options[index] = {
			...new_options[index],
			label: e.target.value,
		};

		setRadios(new_options);
		props.setAttributes({ options: new_options });
	};

	const handleCheck = (c, index) => {
		let new_options = clone(options);

		new_options.forEach((v) => (v.checked = false));

		new_options[index].checked = c;

		setRadios(new_options);
		props.setAttributes({ options: new_options });
	};

	const handleImage = (img, index, action) => {
		let new_options = clone(options);

		if (action === "add") {
			new_options[index] = {
				...new_options[index],
				image: img,
			};
		}

		if (action === "remove") {
			const RadioToRemove = new_options[index];
			new_options[index] = {
				label: RadioToRemove.label,
			};
		}

		setRadios(new_options);
		props.setAttributes({ options: new_options });
	};

	let handleDuplicate = (index) => {
		let new_options = clone(options);

		new_options.splice(index, 0, new_options[index]);

		setRadios(new_options);
		props.setAttributes({ options: new_options });
	};

	let handleEnter = (index) => {
		let new_options = clone(options);

		new_options.splice(index + 1, 0, { label: "" });

		setRadios(new_options);
		props.setAttributes({ options: new_options });
		setFocus({ f: true, index: index + 1 });
	};

	let handleBackspace = (index) => {
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

	let clearAll = () => {
		const reset = [
			{
				label: "Option 1",
			},
		];

		setRadios(reset);
		props.setAttributes({
			options: reset,
		});
	};

	const handleAdminId = (id) => {
		props.setAttributes({
			adminId: {
				...adminId,
				value: id.replace(/\s|-/g, "_"),
			},
		});
	};

	return [
		<InspectorControls>
			<PanelBody title="Field Settings" initialOpen={true}>
				<div className="cwp-option">
					<TextControl
						placeholder={adminId.default}
						label={__("Field ID", "forms-gutenberg")}
						value={adminId.value}
						onChange={handleAdminId}
					/>
				</div>

				{!enableCondition ? (
					<PanelRow>
						<h3 className="cwp-heading">
							{__("Required", "forms-gutenberg")}
						</h3>
						<FormToggle
							label="Required"
							checked={isRequired}
							onChange={handleRequired}
						/>
					</PanelRow>
				) : (
					<div className="cwp-option">
						<p>
							<Icon icon="info" />{" "}
							{__(
								"You cannot set a conditional field required!",
								"forms-gutenberg"
							)}
						</p>
					</div>
				)}
				{isRequired && (
					<div className="cwp-option">
						<h3 className="cwp-heading">
							{__("Required Text", "forms-gutenberg")}
						</h3>
						<TextControl
							onChange={(label) =>
								props.setAttributes({ requiredLabel: label })
							}
							value={requiredLabel}
						/>
					</div>
				)}
				<div className="cwp-option">
					<SelectControl
						label={__("Layout", "forms-gutenberg")}
						value={fieldStyle}
						options={[
							{ label: __("Block", "forms-gutenberg"), value: "block" },
							{ label: __("Inline", "forms-gutenberg"), value: "inline" },
						]}
						onChange={(s) => {
							props.setAttributes({ fieldStyle: s });
						}}
					/>
				</div>
			</PanelBody>
			<PanelBody title={__("Show Hint", "forms-gutenberg")}>
				<div className="cwp-option">
					<FormToggle
						label="Show Hint"
						checked={showHint}
						onChange={() => props.setAttributes({ showHint: !showHint })}
					/>
					{showHint && (
						<Fragment>
							<TextControl
								label={__("Hint Text", "forms-gutenberg")}
								onChange={(hint) => props.setAttributes({ hint })}
								value={hint}
							/>
						</Fragment>
					)}
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
				<PanelBody title={__("Messages", "forms-gutenberg")}>
					<div className="cwp-option">
						<h3 className="cwp-heading">
							{__("Required Error", "forms-gutenberg")}
						</h3>
						<TextControl
							onChange={(label) => setMessages("empty", label)}
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
			{bulkAdd ? (
				<Bulk_Add onChange={(c) => setRadios(c)} data={props} />
			) : (
				<Fragment>
					<div
						ref={radiosContainer}
						className={`cwp-radios-set ${
							!props.isSelected ? "cwp-radio-set-preview" : ""
						}`}
					>
						<div className="cwp-label-wrap">
							<RichText
								placeholder={__("Add a label", "forms-gutenberg")}
								tag="label"
								value={label}
								onChange={handleLabel}
							/>
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
												onKeyDown={(e) => {
													e.key === "Enter" && handleEnter(index);
													e.key === "Backspace" && handleBackspace(index);
												}}
												onChange={(e) => handleChange(e, index)}
												type="text"
												value={radio.label}
											/>
										) : (
											<label>
												{radio.label}{" "}
												{hasImage && !props.isSelected && (
													<ImagePreview
														onEdit={(img) => handleImage(img, index, "add")}
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
													onSelect={(img) => handleImage(img, index, "add")}
												/>
												<Button
													isDefault
													onClick={() => handleDuplicate(index)}
												>
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
											onEdit={(img) => handleImage(img, index, "add")}
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
								<div>
									<Button isDefault onClick={addRadio}>
										{__("Add Option", "forms-gutenberg")}
									</Button>
									<Button
										isDefault
										onClick={() => props.setAttributes({ bulkAdd: true })}
									>
										{__("Bulk Add", "forms-gutenberg")}
									</Button>
								</div>
								<div>
									<Button onClick={clearAll}>
										{__("Clear All", "forms-gutenberg")}
									</Button>
								</div>
							</div>
						)}
					</div>
				</Fragment>
			)}
			{showHint && (
                <p className="cwp-hint">{hint}</p>
            )}
		</div>,
	];
}

export default edit;
