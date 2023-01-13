const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import emailEdit from "./edit.js";
import emailSave from "./save.js";
import { getFieldTransform } from "../../block/functions";
import { fieldParents, myAttrs } from "../../constants";

import blockData from "./block.json";

const { title, attributes } = blockData;

import { deprecation } from "./deprecated/deprecation";

registerBlockType("cwp/email", {
	title: __(title),
	icon: "email",
	category: "gutenberg-forms",
	keywords: [__("gutenberg-forms"), __("forms"), __("mail")],
	edit: emailEdit,
	save: emailSave,
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map((block) => "cwp/".concat(block)),
				transform: (a) => getFieldTransform(a, "email"),
			},
		],
	},
	deprecated: deprecation,
	attributes,
	parent: fieldParents,
});
