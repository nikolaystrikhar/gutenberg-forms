import React, { useRef, useState } from "react";
import { map, isEmpty } from "lodash";
import { Fragment } from "@wordpress/element";
import {
	DropdownMenu,
	MenuGroup,
	MenuItem,
	Notice,
	TextControl
} from "@wordpress/components";
import { getFieldIcon, serializeFields } from "../misc/helper";
import $ from "jquery";
const { getBlock } = wp.data.select("core/block-editor");

function TemplateBuilder(prop) {
	const props = prop.data;

	const { clientId } = props,
		{ template, email, fromEmail } = props.attributes;

	let child_fields = getBlock(clientId).innerBlocks;

	const handleChange = (e, t) => {
		let v = e.target.value;

		props.setAttributes({
			template: JSON.stringify({ ...JSON.parse(template), [t]: v })
		});
	};

	const bodyArea = useRef(),
		subjectArea = useRef();

	const subject = JSON.parse(template).subject;
	const body = JSON.parse(template).body;

	const [currentForm, setCurrentForm] = useState("subject");

	const addFieldId = name => {
		var $txt = $(
			currentForm === "subject" ? subjectArea.current : bodyArea.current
		);
		var caretPos = $txt[0].selectionStart;
		var textAreaTxt = $txt.val();
		var txtToAdd = `{{${name}}}`;

		const val =
			textAreaTxt.substring(0, caretPos) +
			txtToAdd +
			textAreaTxt.substring(caretPos);

		if (currentForm === "subject") {
			props.setAttributes({
				template: JSON.stringify({
					...JSON.parse(template),
					subject: val
				})
			});
		} else {
			props.setAttributes({
				template: JSON.stringify({
					...JSON.parse(template),
					body: val
				})
			});
		}
	};

	return (
		<div className="cwp-template-builder">
			<div className="cwp_data_drop">
				<DropdownMenu icon="list-view" label="Add Field Data">
					{({ onClose }) => (
						<Fragment>
							<MenuGroup>
								{map(serializeFields(child_fields), field => {
									const { fieldName, field_id, blockName } = field;

									return (
										<MenuItem
											icon={getFieldIcon(blockName)}
											onClick={() => {
												onClose();
												addFieldId(field_id);
											}}
										>
											<span draggable={true}>{fieldName.toLowerCase()}</span>
										</MenuItem>
									);
								})}
							</MenuGroup>
						</Fragment>
					)}
				</DropdownMenu>
			</div>

			<div className="cwp-builder-field">
				<label>To</label>
				<input
					value={email}
					onChange={e => props.setAttributes({ email: e.target.value })}
				/>
			</div>

			{/* <div className="cwp-builder-field">
				<label>From</label>
				<input
					value={fromEmail}
					onChange={e => props.setAttributes({ fromEmail: e.target.value })}
				/>
			</div> */}
			<div className="cwp-builder-field">
				<label>Subject</label>
				<input
					ref={subjectArea}
					onClick={() => setCurrentForm("subject")}
					value={subject}
					onChange={e => handleChange(e, "subject")}
				/>
			</div>

			<div className="cwp-builder-field">
				<label>Body</label>
				<textarea
					ref={bodyArea}
					value={body}
					onClick={() => setCurrentForm("body")}
					onChange={e => {
						handleChange(e, "body");
					}}
				></textarea>
			</div>
		</div>
	);
}

export default TemplateBuilder;
