const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import mainEdit from "./edit";
import mainSave from "./save";
import { getGlobalMessages } from "../../block/functions";
import { fieldSupport } from "../../constants";
import { deprecation } from "./deprecated/deprecated";

import blockData from "./block.json";

const blockAttributes = {
	...blockData.attributes,
	messages: {
		type: "array",
		default: getGlobalMessages(),
	},
	template: {
		type: "string",
		default: JSON.stringify({
			subject: "",
			body: "",
		}),
	},
};

registerBlockType("cwp/block-gutenberg-forms", {
	supports: {
		...fieldSupport,
		reusable: false,
	},
	title: __(blockData.title),
	icon: __("feedback"),
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms")],
	attributes: blockAttributes,
	deprecated: deprecation,
	edit: mainEdit,
	save: mainSave,
});
