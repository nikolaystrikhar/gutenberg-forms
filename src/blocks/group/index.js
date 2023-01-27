const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;

import { attributes, title } from "./block.json";
import formGroupEdit from "./edit.js";
import { fieldParents } from "../../constants";
import { deprecated } from "./deprecated/deprecated";

registerBlockType("cwp/form-group", {
	title: __(title, "forms-gutenberg"),
	icon: "forms",
	category: "gutenberg-forms",
	keywords: [
		__("gutenberg-forms", "forms-gutenberg"),
		__("forms", "forms-gutenberg"),
		__("form group", "forms-gutenberg"),
		__("column", "forms-gutenberg"),
	],
	supports: {
		align: ["wide", "full", "center"],
	},
	attributes,
	edit: formGroupEdit,
	parent: fieldParents,
	deprecated: deprecated,
});
