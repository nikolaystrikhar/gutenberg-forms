const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
import { fieldParents, myAttrs } from "../../constants.js";
import { getFieldTransform } from "../../block/functions";
import checkboxEdit from "./edit.js";
import checkboxSave from "./save.js";

import blockData from "./block.json";

const { title, attributes } = blockData;

registerBlockType("cwp/checkbox", {
	title: __(title),
	icon: "yes",
	category: "gutenberg-forms",
	keywords: [__("gutenberg-forms"), __("forms"), __("checkbox")],
	edit: checkboxEdit,
	save: checkboxSave,
	attributes,
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map((block) => "cwp/".concat(block)),
				transform: (a) => getFieldTransform(a, "checkbox"),
			},
		],
	},
	parent: fieldParents,
});
