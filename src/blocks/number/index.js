const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;

import numberEdit from "./edit.js";
import Icon from "../../block/Icon.js";
import { title, attributes } from "./block.json";
import { getFieldTransform } from "../../block/functions";
import { fieldParents, myAttrs } from "../../constants";
import { deprecated } from "./deprecated/deprecated";

registerBlockType("cwp/number", {
	title: __(title, "forms-gutenberg"),
	icon: __(<Icon icon="number" />),
	category: "gutenberg-forms",
	keywords: [__("gutenberg-forms", "forms-gutenberg"), __("forms", "forms-gutenberg"), __("number", "forms-gutenberg")],
	attributes,
	edit: numberEdit,
	parent: fieldParents,
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map((block) => "cwp/".concat(block)),
				transform: (a) => getFieldTransform(a, "number"),
			},
		],
	},
	deprecated: deprecated,
});
