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

import { clone, pullAt, has, set } from "lodash";
import ImageUpload from "../../block/components/imageUpload";
import ImagePreview from "../../block/components/imagePreview";
import ConditionalLogic from "../../block/components/condition";
import {
	getFieldName,
	extract_id,
	getEncodedData,
	extract_admin_id,
	get_admin_id,
} from "../../block/misc/helper";
import Bulk_Add from "../components/bulk_add";
import { detect_similar_forms } from "../../block/functions";

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
		messages,
		messages: { empty },
		condition,
		enableCondition,
		fieldStyle,
		bulkAdd,
		adminId,
		hint,
		showHint,
	} = props.attributes;

	const [checkboxes, setCheckboxes] = useState([]);
	const [focus, setFocus] = useState({
		f: false,
		index: null,
	});

	let checkboxContainer = useRef();

	const getRootData = () => {
		if (field_name === "" || detect_similar_forms(props.clientId)) {
			const newFieldName = getFieldName("checkbox", props.clientId);

			props.setAttributes({
				field_name: newFieldName,
				adminId: {
					value: extract_admin_id(newFieldName, "checkbox"),
					default: extract_admin_id(newFieldName, "checkbox"),
				},
			});

			props.setAttributes({
				id:
					props.clientId +
					"__" +
					getEncodedData(
						"checkbox",
						props.clientId,
						isRequired,
						get_admin_id(adminId)
					) +
					"[]",
			});
		} else if (field_name !== "") {
			props.setAttributes({
				id:
					extract_id(field_name) +
					"__" +
					getEncodedData(
						"checkbox",
						extract_id(field_name),
						isRequired,
						get_admin_id(adminId)
					) +
					"[]",
			});
		}
	};

	useEffect(() => {
		let { options } = props.attributes;

		setCheckboxes(options);
		getRootData();
	}, []);

	useEffect(() => getRootData(), [props]);

	const setMessages = (type, m) => {
		let newMessages = clone(messages);

		set(newMessages, type, m);

		props.setAttributes({ messages: newMessages });
	};

	useEffect(() => {
		if (bulkAdd) return;

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
			checked: false,
		};

		let new_options = clone(checkboxes);

		new_options.push(newOption);

		props.setAttributes({ options: new_options });
		setCheckboxes(new_options);
	};

	const handleDelete = (index) => {
		let new_options = clone(options);

		let deleted_options = pullAt(new_options, [index]); //dosen't matter :-D

		props.setAttributes({ options: new_options });
		setCheckboxes(new_options);
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
				image: img,
			};
		}

		if (action === "remove") {
			const checkboxToRemove = new_options[index];
			new_options[index] = {
				label: checkboxToRemove.label,
			};
		}

		setCheckboxes(new_options);
		props.setAttributes({ options: new_options });
	};

	let handleDuplicate = (index) => {
		let new_options = clone(options);

		new_options.splice(index, 0, new_options[index]);

		setCheckboxes(new_options);
		props.setAttributes({ options: new_options });
	};

	let handleEnter = (index) => {
		let new_options = clone(options);

		new_options.splice(index + 1, 0, { label: "" });

		setCheckboxes(new_options);
		props.setAttributes({ options: new_options });
		setFocus({ f: true, index: index + 1 });
	};

	let handleBackspace = (index) => {
		if (checkboxes[index].label === "") {
			handleDelete(index);

			if (checkboxes[index - 1]) {
				setFocus({ f: true, index: index - 1 });
			}
		}
	};

	let clearAll = () => {
		const reset = [
			{
				label: "Option 1",
			},
		];

		setCheckboxes(reset);
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
			<PanelBody
				title={__("Field Settings", "forms-gutenberg")}
				initialOpen={true}
			>
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
			{isRequired && (
				<PanelBody title="Messages">
					<div className="cwp-option">
						<h3 className="cwp-heading">
							{__("Required Error", "forms-gutenberg")}
						</h3>
						<TextControl
							onChange={(label) => setMessages("empty", label)}
							value={messages.empty}
						/>
					</div>
				</PanelBody>
			)}
			<PanelBody title={__("Condition", "forms-gutenberg")}>
				<ConditionalLogic
					condition={condition}
					set={props.setAttributes}
					clientId={props.clientId}
					useCondition={props.attributes.enableCondition}
				/>
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
		</InspectorControls>,
		null,
		<div
			className={`cwp-checkbox cwp-field ${props.className} is-style-${fieldStyle}`}
		>
			{bulkAdd ? (
				<Bulk_Add onChange={(c) => setCheckboxes(c)} data={props} />
			) : (
				<Fragment>
					<div
						ref={checkboxContainer}
						className={`cwp-checkbox-set-backend cwp-checkbox-set ${
							!props.isSelected ? "cwp-checkbox-set-preview" : ""
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
												onChange={(e) => handleChange(e, index)}
												onKeyDown={(e) => {
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
														onEdit={(img) => handleImage(img, index, "add")}
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
									{hasImage && props.isSelected && (
										<ImagePreview
											onEdit={(img) => handleImage(img, index, "add")}
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
								<div>
									<Button isDefault onClick={addCheckbox}>
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
			{showHint && <p className="cwp-hint">{hint}</p>}
		</div>,
	];
}

export default edit;
