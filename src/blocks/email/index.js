const { registerBlockType } = wp.blocks;

import metadata from './block.json';
import edit from "./edit.js";
import deprecated from "./deprecated/deprecated";
import { myAttrs } from "../../constants";
import { getFieldTransform } from "../../block/functions";

registerBlockType(metadata, {
	edit,
	deprecated,
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map((block) => "cwp/".concat(block)),
				transform: (a) => getFieldTransform(a, "email"),
			},
		],
	},
});

