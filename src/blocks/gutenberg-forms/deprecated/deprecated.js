import blockData from "../block.json";
import { getGlobalMessages } from "../../../block/functions";

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
	},
];
