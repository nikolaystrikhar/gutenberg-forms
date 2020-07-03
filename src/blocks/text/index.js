const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import textEdit from "./edit";
import textSave from "./save";
import { getFieldTransform } from "../../block/functions";
import { fieldParents, myAttrs } from "../../constants";
import blockData from "./block.json";
const { attributes, title } = blockData;

registerBlockType("cwp/text", {
	title: __(title),
	icon: "text",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("text")],
	edit: textEdit,
	save: textSave,
	attributes,
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map((block) => "cwp/".concat(block)),
				transform: (a) => getFieldTransform(a, "text"),
			},
		],
	},
	parent: fieldParents,
});
