const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;

import stepFormEdit from "./edit";
import stepFormSave from "./save";

import blockData from "./block.json";
const { attributes, title } = blockData;

registerBlockType("cwp/form-step", {
	title: __(title),
	icon: "editor-ol-rtl",
	category: "gutenberg-forms",
	keywords: [
		__("gutenberg-forms"),
		__("forms"),
		__("form-step"),
		__("step"),
		__("multistep"),
	],
	edit: stepFormEdit,
	save: stepFormSave,
	attributes,
	parent: ["cwp/form-steps"],
});
