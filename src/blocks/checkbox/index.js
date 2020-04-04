const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import { fieldParents, myAttrs } from '../../constants.js';
import { getFieldTransform } from '../../block/functions';
import checkboxEdit from './edit.js';
import checkboxSave from './save.js';


registerBlockType("cwp/checkbox", {
	title: __("checkbox"),
	icon: "yes",
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
					label: "Option 1"
				}
			]
		},
		enableCondition: {
			type: "boolean",
			default: false
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
		messages: {
			type: "object",
			default: {
				empty: "Please select atleast one checkbox!"
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
				transform: a => getFieldTransform(a, "checkbox")
			}
		]
	},
	parent: fieldParents
});

