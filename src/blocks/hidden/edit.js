import React, { useEffect, useState, useRef } from "react";
import {
	getFieldName,
	extract_admin_id,
	get_admin_id,
	getEncodedData,
	extract_id,
} from "../../block/misc/helper";
import {
	PanelBody,
	TextControl,
	Popover,
	IconButton,
} from "@wordpress/components";
import { detect_similar_forms } from "../../block/functions";
import TagSelector from "../../block/components/tagSelector";
import $ from "jquery";

const { InspectorControls } = wp.blockEditor;
const { __ } = wp.i18n;

function edit(props) {
	const { field_name, adminId, value } = props.attributes;
	const { setAttributes, isSelected } = props;

	const [selector, setSelector] = useState(false);
	const hiddenField = useRef();

	const setData = () => {
		if (field_name === "" || detect_similar_forms(props.clientId)) {
			const newFieldName = getFieldName("hidden", props.clientId);

			setAttributes({
				field_name: newFieldName,
				adminId: {
					value: extract_admin_id(newFieldName, "hidden"),
					default: extract_admin_id(newFieldName, "hidden"),
				},
			});

			setAttributes({
				id:
					props.clientId +
					"__" +
					getEncodedData(
						"hidden",
						props.clientId,
						false, // isRequired
						get_admin_id(adminId)
					),
			});
		} else if (field_name !== "") {
			setAttributes({
				id:
					extract_id(field_name) +
					"__" +
					getEncodedData(
						"hidden",
						extract_id(field_name),
						false, // isRequired
						get_admin_id(adminId)
					),
			});
		}
	};

	useEffect(() => {
		setData();
	}, []);

	useEffect(() => setData(), [props]);

	const handleChange = (event) => {
		const { value } = event.target;

		setAttributes({
			value,
		});
	};

	const handleAdminId = (id) => {
		setAttributes({
			adminId: {
				...adminId,
				value: id.replace(/\s|-/g, "_"),
			},
		});
	};

	const insertTag = (tag) => {
		const text_field = $(hiddenField.current);

		const caretPos = text_field[0].selectionStart;
		const textAreaTxt = text_field.val();

		const value =
			textAreaTxt.substring(0, caretPos) +
			tag +
			textAreaTxt.substring(caretPos);

		props.setAttributes({
			value,
		});
	};

	const icon = selector && isSelected ? "no-alt" : "list-view";

	return [
		<InspectorControls>
			<PanelBody initialOpen={true} title={__("Field Settings", "forms-gutenberg")}>
				<div className="cwp-option">
					<TextControl
						placeholder={adminId.default}
						label={__("Field ID", "forms-gutenberg")}
						value={adminId.value}
						onChange={handleAdminId}
					/>
				</div>
			</PanelBody>
		</InspectorControls>,
		null,
		<div className="cwp-field cwp-hidden">
			<input
				ref={hiddenField}
				type="text"
				value={value}
				placeholder={__("Enter value...", "forms-gutenberg")}
				onChange={handleChange}
			/>
			<div>
				<IconButton
					className="cwp-tag-opener"
					icon={icon}
					label={__("Add Dynamic Data", "forms-gutenberg")}
					onClick={() => setSelector(!selector)}
				/>
				{selector && isSelected && (
					<Popover position="bottom center" className="cwp-tag-selector">
						<TagSelector {...props} insertTag={insertTag} />
					</Popover>
				)}
			</div>
		</div>,
	];
}

export default edit;
