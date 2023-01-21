const { __ } = wp.i18n;
const { registerBlockType, createBlock } = wp.blocks;

import { attributes, title } from "./block.json";
import formColumnEdit from "./edit.js";
import { fieldParents } from "../../constants";
import { deprecated } from "./deprecated/deprecated";


registerBlockType("cwp/form-column", {
	title: __(title, "forms-gutenberg"),
	icon: "editor-table",
	category: "gutenberg-forms",
	keywords: [
		__("gutenberg-forms", "forms-gutenberg"),
		__("forms", "forms-gutenberg"),
		__("form-column", "forms-gutenberg"),
		__("column", "forms-gutenberg"),
	],
	// TODO duplicated key align
	supports: {
		align: true,
		align: ["wide", "full", "center"],
	},
	attributes,
	edit: formColumnEdit,
	parent: fieldParents,
	deprecated: deprecated,
});
