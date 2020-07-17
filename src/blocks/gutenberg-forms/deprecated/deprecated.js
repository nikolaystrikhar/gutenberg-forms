import blockData from "../block.json";
import { getGlobalMessages } from "../../../block/functions";
import save from "./save";
import edit from "./edit";

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

export const deprecation = [
	{
		attributes: blockAttributes,
		edit,
		save,
	},
];
