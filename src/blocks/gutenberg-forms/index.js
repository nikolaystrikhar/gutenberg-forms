const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import mainEdit from "./edit";
import mainSave from "./save";
import { getGlobalMessages } from "../../block/functions";
import { fieldSupport } from "../../constants";
import { deprecated } from "./deprecated";

const attributes = {
	submitLabel: {
		type: "string",
		default: "Submit",
	},
	buttonSetting: {
		type: "object",
		default: {
			disable: false,
			alignment: "justify-start",
		},
	},
	id: {
		type: "string",
		default: "",
	},
	templateBuilder: {
		type: "boolean",
		default: false,
	},
	template: {
		type: "string",
		default: JSON.stringify({
			subject: "",
			body: "",
		}),
	},
	email: {
		type: "string",
		default: "",
	},
	cc: {
		type: "string",
		default: "",
	},
	bcc: {
		type: "string",
		default: "",
	},
	fromEmail: {
		type: "string",
		default: "",
	},
	successURL: {
		type: "string",
		default: "",
	},
	successType: {
		type: "string",
		default: "message",
	},
	successMessage: {
		type: "string",
		default: "The form has been submitted Successfully!",
	},
	messages: {
		type: "array",
		default: getGlobalMessages(),
	},
	theme: {
		type: "object",
		default: {
			accentColor: "rgb(49, 49, 49)",
			textColor: "",
			fieldBackgroundColor: "",
		},
	},
	formType: {
		type: "string",
		default: "",
	},
	encryption: {
		type: "string",
		default: "",
	},
	hideFormOnSuccess: {
		type: "boolean",
		default: false,
	},
	cpt: {
		type: "boolean",
		default: false,
	},
	formLabel: {
		type: "string",
		default: "",
	},
	integrations: {
		type: "object",
		default: {},
	},
	actions: {
		type: "array",
		default: ["Record Entries", "Email Notification"],
	},
	spamProtections: {
		type: "array",
		default: [],
	},
	buttonStyling: {
		type: "object",
		default: {
			backgroundColor: "white",
		},
	},
};

registerBlockType("cwp/block-gutenberg-forms", {
	supports: {
		...fieldSupport,
		reusable: false,
	},
	title: __("Gutenberg Forms"),
	icon: __("feedback"),
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms")],
	attributes,
	edit: mainEdit,
	save: mainSave,
});
