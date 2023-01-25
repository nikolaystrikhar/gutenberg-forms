const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import mainEdit from "./edit";
import mainSave from "./save";
import {
	getGlobalMessages,
	get_submission_message,
} from "../../block/functions";
import { fieldSupport } from "../../constants";
import { deprecation } from "./deprecated/deprecated";
import { get } from "lodash";

import blockData from "./block.json";

const { error, spam } = get_submission_message();

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
	spamMessage: {
		type: "string",
		default: get(spam, "value"),
	},
	errorMessage: {
		type: "string",
		default: get(error, "value"),
	},
};

registerBlockType("cwp/block-gutenberg-forms", {
	supports: {
		...fieldSupport,
		reusable: false,
	},
	title: __(blockData.title),
	icon: __("feedback"),
	category: "gutenberg-forms",
	keywords: [__("gutenberg-forms"), __("forms")],
	example: blockData.example,
	attributes: blockAttributes,
	deprecated: deprecation,
	edit: mainEdit,
	save: mainSave,
});
