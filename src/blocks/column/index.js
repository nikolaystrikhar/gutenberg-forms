const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import columnEdit from "./edit.js";
import columnSave from "./save.js";

// Child block for the form-column block for creating layouts

registerBlockType("cwp/column", {
	title: __("Column"),
	icon: "editor-table",
	category: "common",
	keywords: [
		__("gutenberg-forms"),
		__("forms"),
		__("form-column"),
		__("column")
	],
	edit: columnEdit,
	save: columnSave,
	attributes: {},
	parent: ["cwp/form-column"]
});
