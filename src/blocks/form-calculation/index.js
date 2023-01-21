const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;

import Icon from "../../block/Icon.js";
import { attributes, title } from "./block.json";
import calculationEdit from "./edit.js";
import { fieldParents } from "../../constants";
import { deprecated } from "./deprecated/deprecated";

registerBlockType("cwp/form-calculation", {
	title: __(title, "forms-gutenberg"),
	icon: __(<Icon icon="calculation" />, "forms-gutenberg"),
	category: "gutenberg-forms",
	keywords: [__("gutenberg-forms", "forms-gutenberg"), __("forms", "forms-gutenberg"), __("calculation", "forms-gutenberg")],
	supports: {
		align: ["wide", "full", "center"],
	},
	attributes,
	edit: calculationEdit,
	parent: fieldParents,
	deprecated: deprecated,
});
