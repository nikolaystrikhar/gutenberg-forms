const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import progressEdit from "./edit.js";
import progressSave from "./save.js";
import { fieldParents } from "../../constants";
import Icon from "../../block/Icon";

import blockData from "./block.json";
const { attributes, title } = blockData;

registerBlockType("cwp/progress", {
	title: __(title),
	icon: __(<Icon icon="progress" />),
	category: "gutenberg-forms",
	keywords: [__("gutenberg-forms"), __("progress"), __("bar")],
	edit: progressEdit,
	save: progressSave,
	attributes,
	parent: fieldParents,
});
