import "./editor.scss";
import "./style.scss";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

////////////////////////////////!MAIN!//////////////////////////////////////////////

import mainEdit from "./edit";
import mainSave from "./save";

////////////////////////////////!MAIN!//////////////////////////////////////////////

////////////////////////////////!email!//////////////////////////////////////////////

import emailEdit from "../Form Childs/email/edit";
import emailSave from "../Form Childs/email/save";

////////////////////////////////!email!//////////////////////////////////////////////

////////////////////////////////!name!//////////////////////////////////////////////

import nameEdit from "../Form Childs/name/edit";
import nameSave from "../Form Childs/name/save";

////////////////////////////////!name!//////////////////////////////////////////////

////////////////////////////////!message!//////////////////////////////////////////////

import messageEdit from "../Form Childs/message/edit";
import messageSave from "../Form Childs/message/save";

////////////////////////////////!message!//////////////////////////////////////////////

////////////////////////////////!checkbox!//////////////////////////////////////////////

import checkboxEdit from "../Form Childs/checkbox/edit";
import checkboxSave from "../Form Childs/checkbox/save";

////////////////////////////////!checkbox!//////////////////////////////////////////////

registerBlockType("cwp/block-gutenberg-forms", {
	title: __("Gutenberg Forms"),
	icon: "shield",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms")],
	edit: mainEdit,
	save: mainSave
});

registerBlockType("cwp/email", {
	title: __("Email"),
	icon: "email",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("mail")],
	edit: emailEdit,
	save: emailSave,
	attributes: {
		email: {
			type: "string",
			default: ""
		},
		isRequired: {
			type: "boolean",
			default: false
		},
		label: {
			type: "string",
			default: "Email"
		}
	},
	parent: ["cwp/block-gutenberg-forms"]
});

registerBlockType("cwp/name", {
	title: __("Name"),
	icon: "admin-users",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("name")],
	edit: nameEdit,
	save: nameSave,
	attributes: {
		name: {
			type: "string",
			default: ""
		},
		isRequired: {
			type: "boolean",
			default: false
		},
		label: {
			type: "string",
			default: "Name"
		}
	},
	parent: ["cwp/block-gutenberg-forms"]
});

registerBlockType("cwp/message", {
	title: __("Message"),
	icon: "testimonial",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("message")],
	edit: messageEdit,
	save: messageSave,
	attributes: {
		message: {
			type: "string",
			default: ""
		},
		isRequired: {
			type: "boolean",
			default: false
		},
		label: {
			type: "string",
			default: "Message"
		}
	},
	parent: ["cwp/block-gutenberg-forms"]
});

registerBlockType("cwp/checkbox", {
	title: __("checkbox"),
	icon: "marker",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("checkbox")],
	edit: checkboxEdit,
	save: checkboxSave,
	attributes: {
		isRequired: {
			type: "boolean",
			default: false
		},
		options: {
			type: "array",
			default: [
				{
					label: "Checkbox 1"
				},
				{
					label: "Checkbox 2"
				}
			]
		},
		label: {
			type: "string",
			default: "Choose One"
		}
	},
	parent: ["cwp/block-gutenberg-forms"]
});
