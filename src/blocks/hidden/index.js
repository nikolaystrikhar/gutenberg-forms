const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import hiddenEdit from "./edit.js";
import hiddenSave from "./save.js";
import { fieldParents } from "../../constants";

import blockData from "./block.json";
const { attributes,title } = blockData;

registerBlockType("cwp/hidden", {
	title: __(title),
	icon: "hidden",
	category: "gutenberg-forms",
	keywords: [__("gutenberg-forms"), __("forms"), __("hidden"), __("field")],
	edit: hiddenEdit,
	save: hiddenSave,
	attributes,
	parent: fieldParents,
});
