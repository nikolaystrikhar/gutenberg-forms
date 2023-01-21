const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;

import nameEdit from "./edit.js";

import { attributes, title } from "./block.json";
import { fieldParents, myAttrs } from "../../constants";
import { getFieldTransform } from "../../block/functions";
import { deprecated } from "./deprecated/deprecated";

registerBlockType("cwp/name", {
	title: __(title, "forms-gutenberg"),
	icon: "admin-users",
	category: "gutenberg-forms",
	keywords: [__("gutenberg-forms", "forms-gutenberg"), __("forms", "forms-gutenberg"), __("name", "forms-gutenberg")],
	attributes,
	edit: nameEdit,
	parent: fieldParents,
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map((block) => "cwp/".concat(block)),
				transform: (a) => getFieldTransform(a, "name"),
			},
		],
	},
	deprecated: deprecated,
});
