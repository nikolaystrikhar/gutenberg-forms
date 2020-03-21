const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import { fieldParents } from '../../constants';
import formGroupEdit from "./edit.js";
import formGroupSave from "./save.js";


registerBlockType("cwp/form-group", {
	title: __("Form Group"),
	icon: "forms",
	category: "common",
	keywords: [
		__("gutenberg-forms"),
		__("forms"),
		__("form group"),
		__("column")
	],
	edit: formGroupEdit,
	save: formGroupSave,
	attributes: {
		styling: {
			type: "object",
			default: {
				backgroundColor: "rgb(238, 238, 238)",
				color: "rgb(49, 49, 49)",
				padding: 25,
				borderColor: "rgb(220, 215, 202)",
				borderWidth: 2,
				borderRadius: 0,
			}
		},
		label: {
			type: "string",
			default: "My Group"
		},
		content: {
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
		enableCondition: {
			type: "boolean",
			default: false
		}
	},
	supports: {
		align: true,
		align: ["wide", "full", "center"]
	},
	parent: fieldParents
});
