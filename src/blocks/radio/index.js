const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import radioEdit from "./edit.js";
import radioSave from "./save.js";
import { getFieldTransform } from "../../block/functions";
import { fieldParents, myAttrs } from "../../constants";

import blockData from "./block.json";
const { attributes, title } = blockData;

registerBlockType("cwp/radio", {
	title: __(title),
	icon: "marker",
	category: "gutenberg-forms",
	keywords: [__("gutenberg-forms"), __("forms"), __("radio")],
	edit: radioEdit,
	save: radioSave,
	attributes,
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map((block) => "cwp/".concat(block)),
				transform: (a) => getFieldTransform(a, "radio"),
			},
		],
	},
	parent: fieldParents,
});
