const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;

import columnEdit from "./edit.js";
import { title, attributes } from "./block.json";
import { deprecated } from "./deprecated/deprecated";

// Child block for the form-column block for creating layouts

registerBlockType("cwp/column", {
	title: __(title, "forms-gutenberg"),
	icon: "editor-table",
	category: "gutenberg-forms",
	keywords: [
		__("gutenberg-forms", "forms-gutenberg"),
		__("forms", "forms-gutenberg"),
		__("form-column", "forms-gutenberg"),
		__("column", "forms-gutenberg"),
	],
	attributes,
	edit: columnEdit,
	parent: ["cwp/form-column"],
	deprecated: deprecated,
});
