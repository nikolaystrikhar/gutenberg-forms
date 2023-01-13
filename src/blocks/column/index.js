const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import columnEdit from "./edit.js";
import columnSave from "./save.js";

import blockData from "./block.json";

// Child block for the form-column block for creating layouts

const { title, attributes } = blockData;

registerBlockType("cwp/column", {
	title: __(title),
	icon: "editor-table",
	category: "gutenberg-forms",
	keywords: [
		__("gutenberg-forms"),
		__("forms"),
		__("form-column"),
		__("column"),
	],
	edit: columnEdit,
	save: columnSave,
	attributes,
	parent: ["cwp/form-column"],
});
