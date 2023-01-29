import metadata from './block.json';
import edit from "./edit.js";
import deprecated from "./deprecated/deprecated";
import { fieldBlockNames } from "../../constants";
import { getFieldTransform } from "../../block/functions";

const { registerBlockType } = wp.blocks;

registerBlockType(metadata, {
	edit,
	deprecated,
	transforms: {
		from: [
			{
				type: "block",
				blocks: fieldBlockNames.map((block) => "cwp/".concat(block)),
				transform: (a) => getFieldTransform(a, "email"),
			},
		],
	},
});

