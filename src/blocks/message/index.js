const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import { getFieldTransform } from '../../block/functions';
import { fieldParents, myAttrs } from '../../constants';
import messageEdit from "./edit.js";
import messageSave from "./save.js";


registerBlockType("cwp/message", {
	title: __("Message"),
	icon: "testimonial",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("message")],
	edit: messageEdit,
	save: messageSave,
	attributes: {
		enableCondition: {
			type: "boolean",
			default: false
		},
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
		},
		id: {
			type: "string",
			default: ""
		},
		height: {
			type: "number",
			default: 200
		},
		field_name: {
			type: "string",
			default: ""
		},
		messages: {
			type: "object",
			default: {
				empty: "Please fill out this field!",
				invalid: "The message {{value}} is not valid!"
			}
		},
		pattern: {
			type: "string",
			default: ""
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
		minimumLength: {
			type: "number",
			default: 0,
		},
		maximumLength: {
			type: "number",
			default: 1000,
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
				transform: a => getFieldTransform(a, "message")
			}
		]
	},
	parent: fieldParents
});
