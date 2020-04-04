const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import { fieldParents } from '../../constants';
import yesNoEdit from "./edit.js";
import yesNoSave from "./save.js";

registerBlockType("cwp/yes-no", {
	title: __("Yes / No"),
	icon: "no",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("yes-no")],
	edit: yesNoEdit,
	save: yesNoSave,
	attributes: {
		yes_no: {
			type: "boolean",
			defaut: false
		},
		requiredLabel: {
			type: "string",
			default: "*"
		},
		isRequired: {
			type: "boolean",
			default: false
		},
		label: {
			type: "string",
			default: "Yes Or No?"
		},
		id: {
			type: "string",
			default: ""
		},
		field_name: {
			type: "string",
			default: ""
		},
		errorValidityText: {
			type: "string",
			default: "Please fill out this field!"
		},
		enableCondition: {
			type: "boolean",
			default: false
		},
		condition: {
			type: "object",
			default: {
				field: null,
				condition: "===",
				value: ""
			}
		},
		adminId: {
			type: "object",
			default: {
				default: "",
				value: ""
			}
		}
	},
	parent: fieldParents
});
