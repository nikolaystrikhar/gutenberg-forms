const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;

import stepsEdit from "./edit";
import stepsSave from "./save";

import blockData from "./block.json";
const { title, attributes } = blockData;

registerBlockType("cwp/form-steps", {
	title: __(title),
	icon: "editor-ol-rtl",
	category: "gutenberg-forms",
	supports: {
		inserter: false,
	},
	keywords: [
		__("gutenberg-forms"),
		__("forms"),
		__("form-step"),
		__("step"),
		__("multistep"),
	],
	edit: stepsEdit,
	save: stepsSave,
	attributes,
	parent: ["cwp/block-gutenberg-forms"],
});
