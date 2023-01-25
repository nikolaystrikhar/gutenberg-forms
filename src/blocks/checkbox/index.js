const { registerBlockType } = wp.blocks;

import metadata from './block.json';
import Edit from "./edit.js";
import { myAttrs } from "../../constants.js";
import { getFieldTransform } from "../../block/functions";
import { deprecated } from "./deprecated/deprecated";

registerBlockType( "cwp/checkbox", {
	edit: Edit,
	deprecated,
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map((block) => "cwp/".concat(block)),
				transform: (a) => getFieldTransform(a, "checkbox"),
			},
		],
	},
	...metadata
} );
