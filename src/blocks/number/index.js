const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import numberEdit from "./edit.js";
import numberSave from "./save.js";
import { getFieldTransform } from "../../block/functions";
import { fieldParents, myAttrs } from "../../constants";
import Icon from "../../block/Icon.js";

import blockData from "./block.json";
const { title, attributes } = blockData;

registerBlockType("cwp/number", {
	title: __(title),
	icon: __(<Icon icon="number" />),
	category: "gutenberg-forms",
	keywords: [__("gutenberg-forms"), __("forms"), __("number")],
	edit: numberEdit,
	save: numberSave,
	attributes,
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map((block) => "cwp/".concat(block)),
				transform: (a) => getFieldTransform(a, "number"),
			},
		],
	},
	parent: fieldParents,
});
