import React, { useRef, useState, useEffect } from "react";
import { map, isEmpty, has } from "lodash";
import { Fragment } from "@wordpress/element";
import {
	DropdownMenu,
	MenuGroup,
	MenuItem,
	Icon,
	Button,
	TextControl,
	ButtonGroup,
	TextareaControl,
	Popover,
	IconButton,
} from "@wordpress/components";
import { getFieldIcon, serializeFields } from "../../../block/misc/helper";
import $ from "jquery";
import TagSelector from "../../../block/components/tagSelector";
const { getBlock } = wp.data.select("core/block-editor");

const { __ } = wp.i18n;

function TemplateBuilder(prop) {
	const props = prop.data;

	const [selector, setSelector] = useState(false);

	const { clientId, isSelected } = props,
		{ template, email, fromEmail, templateBuilder, cc, bcc } = props.attributes;

	const [emailType, setEmailType] = useState("to");

	const root = getBlock(props.clientId);

	const child_fields = !isEmpty(root) ? root.innerBlocks : [];

	const handleChange = (value, t) => {
		props.setAttributes({
			template: JSON.stringify({ ...JSON.parse(template), [t]: value }),
		});
	};

	const bodyArea = useRef(),
		subjectArea = useRef();

	const subject = JSON.parse(template).subject;
	const body = JSON.parse(template).body;

	const bodyId = "cwp-body-" + clientId + "body";

	useEffect(() => {
		if (isEmpty(subject) && isEmpty(body)) {
			props.setAttributes({
				template: JSON.stringify({
					subject: "New Form Submission",
					body: `{{all_data}}`,
				}),
			});
		}
	}, []);

	const [currentForm, setCurrentForm] = useState("subject");

	//? getting the logged in user email address with the help of localize script
	const adminEmail = !isEmpty(cwpGlobal.admin_email)
		? cwpGlobal.admin_email
		: "";

	const addFieldId = (name) => {
		const $txt = $(
			currentForm === "subject" ? subjectArea.current : bodyArea.current
		);

		const text_field = $txt.find("input, textarea");

		const caretPos = text_field[0].selectionStart;
		const textAreaTxt = text_field.val();
		const txtToAdd = name;

		const val =
			textAreaTxt.substring(0, caretPos) +
			txtToAdd +
			textAreaTxt.substring(caretPos);

		if (currentForm === "subject") {
			props.setAttributes({
				template: JSON.stringify({
					...JSON.parse(template),
					subject: val,
				}),
			});
		} else {
			props.setAttributes({
				template: JSON.stringify({
					...JSON.parse(template),
					body: val,
				}),
			});
		}
	};

	const getActiveEmailType = (t) => {
		if (emailType === t) {
			return {
				isPrimary: true,
			};
		}

		return {
			isDefault: true,
		};
	};

	const getEmailTypeInput = () => {
		switch (emailType) {
			case "to":
				return (
					<TextControl
						value={email}
						placeholder={adminEmail}
						onChange={(email) => props.setAttributes({ email })}
					/>
				);
			case "bcc":
				return (
					<TextControl
						value={bcc}
						placeholder={"BCC.."}
						onChange={(bcc) => props.setAttributes({ bcc })}
					/>
				);
			case "cc":
				return (
					<TextControl
						value={cc}
						placeholder={"CC.."}
						onChange={(cc) => props.setAttributes({ cc })}
					/>
				);
		}
	};

	const icon = selector && isSelected ? "no-alt" : "list-view";

	return (
		<div className="cwp-template-builder">
			<div className="cwp_data_drop">
				<span>
					<strong>Field Data</strong>
				</span>

				<div>
					<IconButton
						icon={icon}
						isDefault
						className="cwp-tag-opener"
						label={__("Add Dynamic Data", "forms-gutenberg")}
						onClick={() => setSelector(!selector)}
					/>
					{selector && isSelected && (
						<Popover position="top center" className="cwp-tag-selector">
							<TagSelector {...props} insertTag={addFieldId} />
						</Popover>
					)}
				</div>
			</div>

			<div className="cwp-builder-field">
				<TextControl
					label={__("From", "forms-gutenberg")}
					value={fromEmail}
					placeholder={__("Name, Email", "forms-gutenberg")}
					onChange={(fromEmail) => props.setAttributes({ fromEmail })}
				/>
			</div>

			<div className="cwp-builder-field">
				<div className="to-field">
					<span>{__("To", "forms-gutenberg")}</span>
					<ButtonGroup>
						<Button
							{...getActiveEmailType("to")}
							onClick={() => setEmailType("to")}
							isSmall
						>
							TO
						</Button>
						<Button
							isSmall
							onClick={() => setEmailType("cc")}
							{...getActiveEmailType("cc")}
						>
							CC
						</Button>
						<Button
							isSmall
							onClick={() => setEmailType("bcc")}
							{...getActiveEmailType("bcc")}
						>
							BCC
						</Button>
					</ButtonGroup>
				</div>
				{getEmailTypeInput()}
			</div>

			<div ref={subjectArea}>
				<TextControl
					label={__("Subject", "forms-gutenberg")}
					onClick={() => setCurrentForm("subject")}
					value={subject}
					onChange={(subject) => handleChange(subject, "subject")}
				/>
			</div>

			<div ref={bodyArea}>
				<TextareaControl
					label={__("Body", "forms-gutenberg")}
					id={clientId.concat("body")}
					value={body}
					onClick={() => setCurrentForm("body")}
					onChange={(body) => handleChange(body, "body")}
				/>
			</div>
		</div>
	);
}

export default TemplateBuilder;
