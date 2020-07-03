const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import phoneEdit from "./edit.js";
import phoneSave from "./save.js";
import { getFieldTransform } from "../../block/functions";
import { fieldParents, myAttrs } from "../../constants";

import blockData from "./block.json";
const { attributes, title } = blockData;

registerBlockType("cwp/phone", {
	title: __(title),
	icon: "phone",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("phone")],
	edit: phoneEdit,
	save: phoneSave,
	attributes,
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map((block) => "cwp/".concat(block)),
				transform: (a) => getFieldTransform(a, "phone"),
			},
		],
	},
	parent: fieldParents,
});
