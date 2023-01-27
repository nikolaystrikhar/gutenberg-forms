const { registerBlockType } = wp.blocks;

import metadata from './block.json';
import Icon from "../../block/Icon.js";
import edit from "./edit.js";
import deprecated from "./deprecated/deprecated";
import { myAttrs } from "../../constants.js";
import { getFieldTransform } from "../../block/functions";

registerBlockType( metadata, {
	icon: <Icon icon="calculation" />,
	edit,
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
} );
