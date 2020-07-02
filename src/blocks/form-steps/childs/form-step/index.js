const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;

import stepFormEdit from "./edit";
import stepFormSave from "./save";

registerBlockType("cwp/form-step", {
	title: __("Step"),
	icon: "editor-ol-rtl",
	category: "common",
	keywords: [
		__("gutenberg-forms"),
		__("forms"),
		__("form-step"),
		__("step"),
		__("multistep"),
	],
	edit: stepFormEdit,
	save: stepFormSave,
	attributes: {
		label: {
			type: "string",
			default: "Form Step",
		},
		hideStep: {
			type: "boolean",
			default: false,
		},
	},
	parent: ["cwp/form-steps"],
});
