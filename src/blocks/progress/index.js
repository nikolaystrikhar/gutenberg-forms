const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;

import Icon from "../../block/Icon";
import { attributes, title } from "./block.json";
import progressEdit from "./edit.js";
import { fieldParents } from "../../constants";
import { deprecated } from "./deprecated/deprecated";

registerBlockType("cwp/progress", {
	title: __(title, "forms-gutenberg"),
	icon: __(<Icon icon="progress" />, "forms-gutenberg"),
	category: "gutenberg-forms",
	keywords: [__("gutenberg-forms", "forms-gutenberg"), __("progress", "forms-gutenberg"), __("bar", "forms-gutenberg")],
	attributes,
	edit: progressEdit,
	parent: fieldParents,
	deprecated: deprecated,
});
