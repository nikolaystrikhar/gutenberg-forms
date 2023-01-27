// ! Deprecated Form-column Edit Version 1

const { __ } = wp.i18n;
const { registerBlockType, createBlock } = wp.blocks;

import formColumnEdit from "../../edit.js";
import formColumnSave from "../../save.js";
import { fieldParents } from "../../../../constants.js";

import blockData from "../../block.json";
const { attributes, title } = blockData;

registerBlockType("cwp/form-column", {
	title: __(title),
	icon: "editor-table",
	category: "gutenberg-forms",
	keywords: [
		__("gutenberg-forms"),
		__("forms"),
		__("form-column"),
		__("column"),
	],
	edit: formColumnEdit,
	save: formColumnSave,
	attributes,
	supports: {
		align: ["wide", "full", "center"],
	},
	parent: fieldParents,
});
