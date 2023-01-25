const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;

import { fieldParents, myAttrs } from "../../constants";
import datePickerEdit from "./edit.js";

import { attributes, title } from "./block.json";
import { getFieldTransform } from "../../block/functions";
import { deprecated } from "./deprecated/deprecated";

registerBlockType("cwp/datepicker", {
	title: __(title),
	icon: "calendar-alt",
	category: "gutenberg-forms",
	keywords: [__("gutenberg-forms"), __("forms"), __("datepicker")],
	attributes,
	edit: datePickerEdit,
	parent: fieldParents,
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map((block) => "cwp/".concat(block)),
				transform: (a) => getFieldTransform(a, "datepicker"),
			},
		],
	},
	deprecated: deprecated,
});
