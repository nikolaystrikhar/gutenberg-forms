const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import nameEdit from "./edit.js";
import nameSave from "./save.js";
import { getFieldTransform } from "../../block/functions";
import { fieldParents, myAttrs } from "../../constants";
import { deprecated } from "./deprecated/deprecated";

import blockData from "./block.json";
const { attributes, title } = blockData;

registerBlockType("cwp/name", {
	title: __(title),
	icon: "admin-users",
	category: "gutenberg-forms",
	keywords: [__("gutenberg-forms"), __("forms"), __("name")],
	edit: nameEdit,
	save: nameSave,
	deprecated,
	attributes,
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map((block) => "cwp/".concat(block)),
				transform: (a) => getFieldTransform(a, "name"),
			},
		],
	},
	parent: fieldParents,
});
