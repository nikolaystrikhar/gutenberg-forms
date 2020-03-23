import "./editor.scss";
import "./style.scss";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

////////////////////////////////!MAIN!//////////////////////////////////////////////

import mainEdit from "./edit";
import mainSave from "./save";

////////////////////////////////!MAIN!//////////////////////////////////////////////

import { applyFormStyles } from "./formStyles/index";
import { registerFieldStyles } from "./fieldStyles/index";
import { getFieldTransform, defaultFieldMessages } from "./functions/index";

//for sanitizing the label

const fieldParents = [
		"cwp/block-gutenberg-forms",
		"cwp/column",
		"cwp/form-group"
	],
	fieldSupport = {
		align: true,
		align: ["wide", "full", "center"]
	};

registerBlockType("cwp/block-gutenberg-forms", {
	supports: fieldSupport,
	title: __("Gutenberg Forms"),
	icon: __("feedback"),
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms")],
	attributes: {
		submitLabel: {
			type: "string",
			default: "Submit"
		},
		buttonSetting: {
			type: "object",
			default: {
				disable: false,
				alignment: "justify-start"
			}
		},
		id: {
			type: "string",
			default: ""
		},
		templateBuilder: {
			type: "boolean",
			default: false
		},
		template: {
			type: "string",
			default: JSON.stringify({
				subject: "",
				body: ""
			})
		},
		email: {
			type: "string",
			default: ""
		},
		fromEmail: {
			type: "string",
			default: ""
		},
		successURL: {
			type: "string",
			default: ""
		},
		successType: {
			type: "string",
			default: "message"
		},
		successMessage: {
			type: "string",
			default: "The form has been submitted Successfully!"
		},
		recaptcha: {
			type: "object",
			default: {
				enable: false,
				siteKey: "",
				clientSecret: ""
			}
		},
		messages: {
			type: "array",
			default: defaultFieldMessages
		},
		theme: {
			type: "object",
			default: {
				accentColor: "",
				textColor: "",
				fieldBackgroundColor: ""
			}
		}
	},
	edit: mainEdit,
	save: mainSave
});

const myAttrs = [
	"email",
	"name",
	"message",
	"checkbox",
	"datepicker",
	"radio",
	"phone",
	"website",
	"text",
	"select",
	"number",
	"yes-no"
];

applyFormStyles("cwp/block-gutenberg-forms"); //registering styles
registerFieldStyles(myAttrs); //registering field styles
