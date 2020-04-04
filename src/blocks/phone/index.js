const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import phoneEdit from "./edit.js";
import phoneSave from "./save.js";
import { getFieldTransform } from '../../block/functions';
import { fieldParents, myAttrs } from '../../constants';


registerBlockType("cwp/phone", {
	title: __("Phone"),
	icon: "phone",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("phone")],
	edit: phoneEdit,
	save: phoneSave,
	attributes: {
		enableCondition: {
			type: "boolean",
			default: false
		},
		phone: {
			type: "string",
			default: ""
		},
		isRequired: {
			type: "boolean",
			default: false
		},
		label: {
			type: "string",
			default: "Phone No:"
		},
		id: {
			type: "string",
			default: ""
		},
		field_name: {
			type: "string",
			default: ""
		},
		requiredLabel: {
			type: "string",
			default: "*"
		},
		messages: {
			type: "object",
			default: {
				empty: "Please fill out this field!",
				invalid: "The phone {{value}} is not valid!"
			}
		},
		pattern: {
			type: "string",
			default: "[\\+\\d\\d\\d\\d\\d\\d\\d\\d\\d\\d\\d]+"
		},
		condition: {
			type: "object",
			default: {
				field: null,
				condition: "===",
				value: ""
			}
		},
		requiredLabel: {
			type: "string",
			default: "*"
		},
		adminId: {
			type: "object",
			default: {
				default: "",
				value: ""
			}
		}
	},
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map(block => "cwp/".concat(block)),
				transform: a => getFieldTransform(a, "phone")
			}
		]
	},
	parent: fieldParents
});
