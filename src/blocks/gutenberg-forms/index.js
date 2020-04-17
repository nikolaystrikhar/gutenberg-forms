const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import mainEdit from "./edit";
import mainSave from "./save";
import { defaultFieldMessages } from '../../block/functions';
import { fieldSupport } from '../../constants';
import { deprecated } from "./deprecated";





const attributes = {
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
	},
	formType: {
		type: "string",
		default: ""
	},
	encryption: {
		type: "string",
		default: ""
	},
	hideFormOnSuccess: {
		type: "boolean",
		default: false
	},
	cpt: {
		type: "boolean",
		default: false
	},
	formLabel: {
		type: "string",
		default: ""
	},
	saveToEntries: {
		type: "boolean",
		default: true
	},
	sendEmail: {
		type: "boolean",
		default: true
	}
}

registerBlockType("cwp/block-gutenberg-forms", {
	supports: {
		...fieldSupport,
		reusable: false
	},
	title: __("Gutenberg Forms"),
	icon: __("feedback"),
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms")],
	attributes,
	edit: mainEdit,
	save: mainSave
});
