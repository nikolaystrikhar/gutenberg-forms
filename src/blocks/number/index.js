const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import numberEdit from "./edit.js";
import numberSave from "./save.js";
import { getFieldTransform } from '../../block/functions';
import { fieldParents, myAttrs } from '../../constants';


registerBlockType("cwp/number", {
	title: __("Number"),
	icon: "screenoptions",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("number")],
	edit: numberEdit,
	save: numberSave,
	attributes: {
		enableCondition: {
			type: "boolean",
			default: false
		},
		number: {
			type: "string",
			default: ""
		},
		isRequired: {
			type: "boolean",
			default: false
		},
		label: {
			type: "string",
			default: "Enter Number:"
		},
		id: {
			type: "string",
			default: ""
		},
		field_name: {
			type: "string",
			default: ""
		},
		isRange: {
			type: "boolean",
			default: false
		},
		steps: {
			type: "number",
			default: 1
		},
		rangeMax: {
			type: "number",
			default: 100
		},
		rangeMin: {
			type: "number",
			default: 0
		},
		requiredLabel: {
			type: "string",
			default: "*"
		},
		errorValidityText: {
			type: "string",
			default: "Please fill out this field!"
		},
		condition: {
			type: "object",
			default: {
				field: null,
				condition: "===",
				value: ""
			}
		},
		messages: {
			type: "object",
			default: {
				empty: "Please fill out this field!",
				invalid: "The number {{value}} is not in range!"
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
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map(block => "cwp/".concat(block)),
				transform: a => getFieldTransform(a, "number")
			}
		]
	},
	parent: fieldParents
});
