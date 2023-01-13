const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import { fieldParents, myAttrs } from "../../constants";
import { getFieldTransform } from "../../block/functions";
import selectEdit from "./edit.js";
import selectSave from "./save.js";

import blockData from "./block.json";
import { deprecated } from "./deprecated/deprecated";
const { attributes, title } = blockData;

registerBlockType("cwp/select", {
	title: __(title),
	icon: "menu-alt",
	category: "gutenberg-forms",
	keywords: [__("gutenberg-forms"), __("forms"), __("select")],
	edit: selectEdit,
	save: selectSave,
	deprecated,
	attributes,
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map((block) => "cwp/".concat(block)),
				transform: (a) => getFieldTransform(a, "select"),
			},
		],
	},
	parent: fieldParents,
});
