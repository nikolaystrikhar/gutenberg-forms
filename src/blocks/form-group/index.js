const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import { fieldParents } from "../../constants";
import formGroupEdit from "./edit.js";
import formGroupSave from "./save.js";

import blockData from "./block.json";
const { attributes, title } = blockData;

registerBlockType("cwp/form-group", {
	title: __(title),
	icon: "forms",
	category: "gutenberg-forms",
	keywords: [
		__("gutenberg-forms"),
		__("forms"),
		__("form group"),
		__("column"),
	],
	edit: formGroupEdit,
	save: formGroupSave,
	attributes,
	supports: {
		align: true,
		align: ["wide", "full", "center"],
	},
	parent: fieldParents,
});
