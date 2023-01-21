const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;

import { attributes, title } from "./block.json";
import hiddenEdit from "./edit.js";
import { fieldParents } from "../../constants";
import { deprecated } from "./deprecated/deprecated";

registerBlockType("cwp/hidden", {
	title: __(title, "forms-gutenberg"),
	icon: "hidden",
	category: "gutenberg-forms",
	keywords: [__("gutenberg-forms", "forms-gutenberg"), __("forms", "forms-gutenberg"), __("hidden", "forms-gutenberg"), __("field", "forms-gutenberg")],
	attributes,
	edit: hiddenEdit,
	parent: fieldParents,
	deprecated: deprecated,
});
