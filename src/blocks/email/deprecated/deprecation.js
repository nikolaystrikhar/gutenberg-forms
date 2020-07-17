/**
 *
 * Handling the deprecation
 */

import blockData from "../block.json";
import edit from "./edit";
import save from "./save";
import { omit } from "lodash";

const { attributes, title } = blockData;

const newAttributes = omit(attributes, ["prefix", "suffix"]); // for testing purpose

export const deprecation = [
	{
		attributes: newAttributes,
		save,
		edit,
	},
];
