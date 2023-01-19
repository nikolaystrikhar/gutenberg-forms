const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import { getFieldTransform } from "../../block/functions";
import { fieldParents, myAttrs } from "../../constants";
import messageEdit from "./edit.js";

import blockData from "./block.json";
const { attributes } = blockData;
import { deprecated } from "./deprecated/deprecated";

registerBlockType("cwp/message", {
	title: __("Textarea", "forms-gutenberg"),
	icon: "testimonial",
	category: "gutenberg-forms",
	keywords: [__("gutenberg-forms", "forms-gutenberg"), __("forms", "forms-gutenberg"), __("message", "forms-gutenberg")],
	attributes,
	edit: messageEdit,
	parent: fieldParents,
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map((block) => "cwp/".concat(block)),
				transform: (a) => getFieldTransform(a, "message"),
			},
		],
	},
	deprecated,
});
