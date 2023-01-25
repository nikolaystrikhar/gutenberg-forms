const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;

import { attributes, title } from "./block.json";
import Icon from "../../block/Icon";
import yesNoEdit from "./edit.js";
import { fieldParents } from "../../constants";
import { deprecated } from "./deprecated/deprecated";

registerBlockType("cwp/yes-no", {
	title: __(title, "forms-gutenberg"),
	icon: __(<Icon icon="switch" />, "forms-gutenberg"),
	category: "gutenberg-forms",
	keywords: [__("gutenberg-forms", "forms-gutenberg"), __("forms", "forms-gutenberg"), __("yes-no", "forms-gutenberg")],
	attributes,
	edit: yesNoEdit,
	parent: fieldParents,
	deprecated: deprecated,
});
