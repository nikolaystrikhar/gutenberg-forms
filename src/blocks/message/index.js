const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import { getFieldTransform } from "../../block/functions";
import { fieldParents, myAttrs } from "../../constants";
import messageEdit from "./edit.js";
import messageSave from "./save.js";

import blockData from "./block.json";
const { attributes, title } = blockData;

registerBlockType("cwp/message", {
	title: __(title),
	icon: "testimonial",
	category: "gutenberg-forms",
	keywords: [__("gutenberg-forms"), __("forms"), __("message")],
	edit: messageEdit,
	save: messageSave,
	attributes,
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map((block) => "cwp/".concat(block)),
				transform: (a) => getFieldTransform(a, "message"),
			},
		],
	},
	parent: fieldParents,
});
