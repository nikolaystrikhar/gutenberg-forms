const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import calculationEdit from "./edit.js";
import calculationSave from "./save.js";
import { fieldParents } from '../../constants';


registerBlockType("cwp/form-calculation", {
	title: __("Calculation"),
	icon: "media-document",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("calculation")],
	edit: calculationEdit,
	save: calculationSave,
	attributes: {
		formulaBuilder: {
			type: "boolean",
			default: true
		},
		calculation: {
			type: "string",
			default: ""
		},
		label: {
			type: "string",
			default: "Total"
		},
		id: {
			type: "string",
			default: ""
		},
		field_name: {
			type: "string",
			default: ""
		},
		formula: {
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
		styling: {
			type: "object",
			default: {
				fontSize: 40
			}
		},
		enableCondition: {
			type: "boolean",
			default: false
		},
		postfix: {
			type: "string",
			default: ""
		},
		prefix: {
			type: "string",
			default: ""
		},
		adminId: {
			type: "object",
			default: {
				default: "",
				value: ""
			}
		}
	},
	supports: {
		align: true,
		align: ["wide", "full", "center"]
	},
	parent: fieldParents
});
