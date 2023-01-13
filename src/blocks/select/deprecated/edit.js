/**
 *
 * ! DEPRECATED EDIT VERSION
 *
 */

import React, { useState, useEffect, useRef, Fragment } from "react";
import {
	FormToggle,
	Toolbar,
	PanelRow,
	PanelBody,
	Icon,
	Button,
	TextControl,
} from "@wordpress/components";
import {
	getFieldName,
	extract_id,
	getEncodedData,
	strip_tags,
	extract_admin_id,
	get_admin_id,
} from "../../../block/misc/helper";

import { clone, pullAt, set, assign } from "lodash";
import {
	getRootMessages,
	detect_similar_forms,
} from "../../../block/functions/index";
import ConditionalLogic from "../../../block/components/condition";
import Bulk_Add from "../../components/bulk_add";

const { __ } = wp.i18n;
const { InspectorControls, BlockControls, BlockIcon } = wp.blockEditor;
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
		bulkAdd,
		adminId,
	} = props.attributes;

	const [select, setSelect] = useState([]);

	const [focus, setFocus] = useState({
		f: false,
		index: null,
	});

	const selectContainer = useRef();

	const getRootData = () => {
		if (field_name === "" || detect_similar_forms(props.clientId)) {
			const newFieldName = getFieldName("select", props.clientId);

			props.setAttributes({
				field_name: newFieldName,
				adminId: {
					value: extract_admin_id(newFieldName, "select"),
					default: extract_admin_id(newFieldName, "select"),
				},
			});
			props.setAttributes({
				id:
					props.clientId +
					"__" +
					getEncodedData(
						"select",
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
						"select",
						extract_id(field_name),
						isRequired,
						get_admin_id(adminId)
					),
			});
		}
	};

	useEffect(() => {
		let rootMessages = getRootMessages(props.clientId, "select");

		if (rootMessages) {
			const newMessages = clone(messages);

			assign(newMessages, rootMessages);

			props.setAttributes({ messages: newMessages });
		}

		let { options } = props.attributes;

		setSelect(options);

		getRootData();
	}, []);

	useEffect(() => getRootData(), [props]);

	useEffect(() => {
		if (bulkAdd) return;

		let boxes = selectContainer.current.querySelectorAll(
			'.cwp-select-option input[type="text"]'
		);

		if (focus.f) {
			if (focus.index === null) {
				boxes[boxes.length - 1].focus();
			} else {
				boxes[focus.index].focus();
			}

			setFocus({ f: false, index: null });
		}
	}, [select, focus]); //subscribing to any further changes...

	const handleRequired = () => {
		const { isRequired } = props.attributes;

		props.setAttributes({ isRequired: !isRequired });
	};

	const addSelect = () => {
		let newOption = {
			label: "Option " + (select.length + 1),
		};

		let new_options = clone(select);

		new_options.push(newOption);

		props.setAttributes({ options: new_options });
		setSelect(new_options);
	};

	const handleDelete = (index) => {
		let new_options = clone(options);

		let deleted_options = pullAt(new_options, [index]); //dosen't matter :-D

		props.setAttributes({ options: new_options });
		setSelect(new_options);
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

		setSelect(new_options);
		props.setAttributes({ options: new_options });
	};

	let handleDuplicate = (index) => {
		let new_options = clone(options);

		new_options.splice(index, 0, new_options[index]);

		setSelect(new_options);
		props.setAttributes({ options: new_options });
	};

	let handleEnter = (index) => {
		let new_options = clone(options);

		new_options.splice(index + 1, 0, { label: "" });

		setSelect(new_options);
		props.setAttributes({ options: new_options });
		setFocus({ f: true, index: index + 1 });
	};

	let handleBackspace = (index) => {
		if (select[index].label === "") {
			handleDelete(index);

			if (select[index - 1]) {
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

		setSelect(reset);
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

	const editView = select.map((s, index) => {
		return (
			<div className="cwp-select-option">
				<input
					aria-label={strip_tags(label)}
					onChange={(e) => handleChange(e, index)}
					type="text"
					value={s.label}
					onKeyDown={(e) => {
						e.key === "Enter" && handleEnter(index);
						e.key === "Backspace" && handleBackspace(index);
					}}
				/>
				<Button isDefault onClick={() => handleDuplicate(index)}>
					<Icon icon="admin-page" />
				</Button>
				<Button isDefault onClick={() => handleDelete(index)}>
					<Icon icon="no-alt" />
				</Button>
			</div>
		);
	});

	const SelectView = () => {
		return (
			<select data-cwp-field>
				<option value="" disabled selected>
					Select your option
				</option>
				{select.map((s, index) => {
					return <option value={s.label}>{s.label}</option>;
				})}
			</select>
		);
	};

	return [
		<InspectorControls>
			<PanelBody title={__("Field Settings", "forms-gutenberg")} initialOpen={true}>
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
						<h3 className="cwp-heading">{__("Required", "forms-gutenberg")}</h3>
						<FormToggle
							label={__("Required", "forms-gutenberg")}
							checked={isRequired}
							onChange={handleRequired}
						/>
					</PanelRow>
				) : (
					<div className="cwp-option">
						<p>
							<Icon icon="info" />{" "}
							{__("You cannot set a conditional field required!", "forms-gutenberg")}
						</p>
					</div>
				)}
				{isRequired && (
					<div className="cwp-option">
						<h3 className="cwp-heading">{__("Required Text", "forms-gutenberg")}</h3>
						<TextControl
							onChange={(label) =>
								props.setAttributes({ requiredLabel: label })
							}
							value={requiredLabel}
						/>
					</div>
				)}
			</PanelBody>
			<PanelBody title={__("Condition", "forms-gutenberg")}>
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
						<h3 className="cwp-heading">{__("Required Error", "forms-gutenberg")}</h3>
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
			className={`cwp-select cwp-field ${
				!props.isSelected ? props.className : ""
			}`}
		>
			{bulkAdd ? (
				<Bulk_Add onChange={(c) => setSelect(c)} data={props} />
			) : (
				<Fragment>
					<div className="cwp-select-set" ref={selectContainer}>
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
						{!!props.isSelected ? editView : <SelectView />}
						{!!props.isSelected && (
							<div className="cwp-select-controls">
								<div>
									<Button isDefault onClick={addSelect}>
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
		</div>,
	];
}

export default edit;
