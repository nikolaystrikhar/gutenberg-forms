const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import textEdit from "./edit";
import textSave from "./save";
import { getFieldTransform } from '../../block/functions';
import { fieldParents, myAttrs } from '../../constants';


registerBlockType("cwp/text", {
	title: __("Text"),
	icon: "text",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("text")],
	edit: textEdit,
	save: textSave,
	attributes: {
		enableCondition: {
			type: "boolean",
			default: false
		},
		text: {
			type: "string",
			default: ""
		},
		isRequired: {
			type: "boolean",
			default: false
		},
		label: {
			type: "string",
			default: "Text"
		},
		id: {
			type: "string",
			default: ""
		},
		field_name: {
			type: "string",
			default: ""
		},
		messages: {
			type: "object",
			default: {
				empty: "Please fill out this field!",
				invalid: "The text {{value}} is not valid!"
			}
		},
		pattern: {
			type: "string",
			default: ""
		},
		minimumLength: {
			type: "number",
			default: 0,
		},
		maximumLength: {
			type: "number",
			default: 100,
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
				transform: a => getFieldTransform(a, "text")
			}
		]
	},
	parent: fieldParents
});
