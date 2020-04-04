const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import radioEdit from "./edit.js";
import radioSave from "./save.js";
import { getFieldTransform } from '../../block/functions';
import { fieldParents, myAttrs } from '../../constants';


registerBlockType("cwp/radio", {
	title: __("Radio"),
	icon: "marker",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("radio")],
	edit: radioEdit,
	save: radioSave,
	attributes: {
		enableCondition: {
			type: "boolean",
			default: false
		},
		isRequired: {
			type: "boolean",
			default: false
		},
		options: {
			type: "array",
			default: [
				{
					label: "Option 1"
				},
				{
					label: "Option 2"
				}
			]
		},
		label: {
			type: "string",
			default: "Choose One"
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
				empty: "Please select radio!"
			}
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
		fieldStyle: {
			type: "string",
			default: "block"
		},
		bulkAdd: {
			type: "boolean",
			default: false
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
				transform: a => getFieldTransform(a, "radio")
			}
		]
	},
	parent: fieldParents
});
