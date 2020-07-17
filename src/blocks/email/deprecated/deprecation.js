/**
 *
 * Handling the deprecation
 */

import blockData from "../block.json";

const { attributes, title } = blockData;

import edit from "./edit";
import save from "./save";

export const deprecation = [
	{
		attributes,
		save,
		edit,
	},
];
