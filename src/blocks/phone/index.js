const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;

import { attributes, title } from "./block.json";
import phoneEdit from "./edit.js";
import { fieldParents, myAttrs } from "../../constants";
import { getFieldTransform } from "../../block/functions";
import { deprecated } from "./deprecated/deprecated";

registerBlockType("cwp/phone", {
	title: __(title, "forms-gutenberg"),
	icon: "phone",
	category: "gutenberg-forms",
	keywords: [__("gutenberg-forms", "forms-gutenberg"), __("forms", "forms-gutenberg"), __("phone", "forms-gutenberg")],
	attributes,
	edit: phoneEdit,
	parent: fieldParents,
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map((block) => "cwp/".concat(block)),
				transform: (a) => getFieldTransform(a, "phone"),
			},
		],
	},
	deprecated: deprecated,
});
