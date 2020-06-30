const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import progressEdit from "./edit.js";
import progressSave from "./save.js";
import { fieldParents } from "../../constants";

registerBlockType("cwp/progress", {
	title: __("Progress Bar"),
	icon: "email",
	category: "common",
	keywords: [__("gutenberg-forms"), __("progress"), __("bar")],
	edit: progressEdit,
	save: progressSave,
	attributes: {
		progressColor: {
			type: "string",
			default: "rgb(238, 238, 238)",
		},
		progressFillColor: {
			type: "string",
			default: "rgb(6, 147, 227)",
		},
		thickness: {
			type: "number",
			default: 20,
		},
		cornerRadius: {
			type: "number",
			default: 0,
		},
		showPercentage: {
			type: "boolean",
			default: true,
		},
		textColor: {
			type: "string",
			default: "rgb(238, 238, 238)",
		},
	},
	parent: fieldParents,
});
