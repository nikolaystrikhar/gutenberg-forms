const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;

import stepsEdit from "./edit";
import stepsSave from "./save";

registerBlockType("cwp/form-steps", {
	title: __("Form Steps"),
	icon: "editor-ol-rtl",
	category: "common",
	keywords: [
		__("gutenberg-forms"),
		__("forms"),
		__("form-step"),
		__("step"),
		__("multistep"),
	],
	edit: stepsEdit,
	save: stepsSave,
	attributes: {
		currentStep: {
			type: "number",
			default: 0,
		},
	},
	parent: ["cwp/block-gutenberg-forms"],
});
