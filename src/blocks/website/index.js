const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;

import { attributes, title } from "./block.json";
import websiteEdit from "./edit.js";
import { fieldParents, myAttrs } from "../../constants";
import { getFieldTransform } from "../../block/functions";
import { deprecated } from "./deprecated/deprecated";

registerBlockType("cwp/website", {
	title: __(title, "forms-gutenberg"),
	icon: "laptop",
	category: "gutenberg-forms",
	keywords: [__("gutenberg-forms"), __("forms", "forms-gutenberg"), __("website", "forms-gutenberg")],
	attributes,
	edit: websiteEdit,
	parent: fieldParents,
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map((block) => "cwp/".concat(block)),
				transform: (a) => getFieldTransform(a, "website"),
			},
		],
	},
	deprecated: deprecated,
});
