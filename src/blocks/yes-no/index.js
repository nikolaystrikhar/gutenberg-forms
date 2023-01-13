const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import { fieldParents } from "../../constants";
import yesNoEdit from "./edit.js";
import yesNoSave from "./save.js";
import Icon from "../../block/Icon";

import blockData from "./block.json";
const { attributes, title } = blockData;

registerBlockType("cwp/yes-no", {
	title: __(title),
	icon: __(<Icon icon="switch" />, "forms-gutenberg"),
	category: "gutenberg-forms",
	keywords: [__("gutenberg-forms"), __("forms"), __("yes-no")],
	edit: yesNoEdit,
	save: yesNoSave,
	attributes,
	parent: fieldParents,
});
