/**
 *
 * Handling the deprecation
 */

import blockData from "../block.json";
import edit from "./edit";
import save from "./save";

const { attributes } = blockData;

export const deprecation = [
	{
		attributes,
		save,
		edit,
	},
];
