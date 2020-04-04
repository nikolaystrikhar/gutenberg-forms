const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import { getFieldTransform } from '../../block/functions';
import { fieldParents, myAttrs } from '../../constants';
import datePickerEdit from './edit.js';
import datePickerSave from './save.js';


registerBlockType("cwp/datepicker", {
	title: __("Date Picker"),
	icon: "calendar-alt",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("datepicker")],
	edit: datePickerEdit,
	save: datePickerSave,
	attributes: {
		enableCondition: {
			type: "boolean",
			default: false
		},
		isRequired: {
			type: "boolean",
			default: false
		},
		label: {
			type: "string",
			default: "Pick Date"
		},
		placeholder: {
			type: "string",
			default: ""
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
		format: {
			type: "string",
			default: "DD/MM/YYYY"
		},
		messages: {
			type: "object",
			default: {
				empty: "Please select date!"
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
				transform: a => getFieldTransform(a, "datepicker")
			}
		]
	},
	parent: fieldParents
});
