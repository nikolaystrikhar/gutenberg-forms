const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import { getFieldTransform } from "../../block/functions";
import { fieldParents, myAttrs } from "../../constants";
import messageEdit from "./edit.js";

import blockData from "./block.json";
const { attributes } = blockData;

registerBlockType("cwp/message-v2", {
	apiVersion: 2,
	title: __("TEST", "forms-gutenberg"),
	icon: "megaphone",
	category: "gutenberg-forms",
	keywords: [__("gutenberg-forms", "forms-gutenberg"), __("forms", "forms-gutenberg"), __("message", "forms-gutenberg")],
	attributes,
	parent: fieldParents,
	edit: messageEdit,
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map((block) => "cwp/".concat(block)),
				transform: (a) => getFieldTransform(a, "message"),
			},
		],
	},
});
