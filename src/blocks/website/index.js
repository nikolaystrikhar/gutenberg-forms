const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import websiteEdit from "./edit.js";
import websiteSave from "./save.js";
import { getFieldTransform } from "../../block/functions";
import { fieldParents, myAttrs } from "../../constants";

import blockData from "./block.json";
import { deprecated } from "./deprecated/deprecated";
const { attributes, title } = blockData;

registerBlockType("cwp/website", {
	title: __(title),
	icon: "laptop",
	category: "gutenberg-forms",
	keywords: [__("gutenberg-forms"), __("forms"), __("website")],
	edit: websiteEdit,
	save: websiteSave,
	deprecated,
	attributes,
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map((block) => "cwp/".concat(block)),
				transform: (a) => getFieldTransform(a, "website"),
			},
		],
	},
	parent: fieldParents,
});
