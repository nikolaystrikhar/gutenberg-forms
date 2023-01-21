const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;

import { attributes, title } from "./block.json";
import textEdit from "./edit";
import { fieldParents, myAttrs } from "../../constants";
import { getFieldTransform } from "../../block/functions";
import { deprecated } from "./deprecated/deprecated";

registerBlockType("cwp/text", {
	title: __(title, "forms-gutenberg"),
	icon: "text",
	category: "gutenberg-forms",
	keywords: [__("gutenberg-forms", "forms-gutenberg"), __("forms", "forms-gutenberg"), __("text", "forms-gutenberg")],
	attributes,
	edit: textEdit,
	parent: fieldParents,
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map((block) => "cwp/".concat(block)),
				transform: (a) => getFieldTransform(a, "text"),
			},
		],
	},
	deprecated: deprecated,
});
