const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import formColumnEdit from './edit.js';
import formColumnSave from './save.js';
import { fieldParents } from '../../constants';

registerBlockType("cwp/form-column", {
	title: __("Form Column"),
	icon: "editor-table",
	category: "common",
	keywords: [
		__("gutenberg-forms"),
		__("forms"),
		__("form-column"),
		__("column")
	],
	edit: formColumnEdit,
	save: formColumnSave,
	attributes: {
		columns: {
			type: "number",
			default: 3
		},
		intro: {
			type: "boolean",
			default: false
		},
		stack: {
			type: "boolean",
			default: true
		}
	},
	supports: {
		align: true,
		align: ["wide", "full", "center"]
	},
	parent: fieldParents
});
