const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;

import { title, attributes } from "./block.json";
import checkboxEdit from "./edit.js";
import { fieldParents, myAttrs } from "../../constants.js";
import { getFieldTransform } from "../../block/functions";
import { deprecated } from "./deprecated/deprecated";


registerBlockType("cwp/checkbox", {
	title: __(title, "forms-gutenberg"),
	icon: "yes",
	category: "gutenberg-forms",
	keywords: [__("gutenberg-forms", "forms-gutenberg"), __("forms", "forms-gutenberg"), __("checkbox", "forms-gutenberg")],
	attributes,
	edit: checkboxEdit,
	parent: fieldParents,
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map((block) => "cwp/".concat(block)),
				transform: (a) => getFieldTransform(a, "checkbox"),
			},
		],
	},
	deprecated: deprecated,
});
