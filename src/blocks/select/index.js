const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;

import { attributes, title } from "./block.json";
import selectEdit from "./edit.js";
import { fieldParents, myAttrs } from "../../constants";
import { getFieldTransform } from "../../block/functions";
import { deprecated } from "./deprecated/deprecated";

registerBlockType("cwp/select", {
	title: __(title, "forms-gutenberg"),
	icon: "menu-alt",
	category: "gutenberg-forms",
	keywords: [__("gutenberg-forms", "forms-gutenberg"), __("forms", "forms-gutenberg"), __("select", "forms-gutenberg")],
	attributes,
	edit: selectEdit,
	parent: fieldParents,
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map((block) => "cwp/".concat(block)),
				transform: (a) => getFieldTransform(a, "select"),
			},
		],
	},
	deprecated: deprecated,
});
