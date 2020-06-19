const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import hiddenEdit from "./edit.js";
import hiddenSave from "./save.js";
import { fieldParents } from "../../constants";

registerBlockType("cwp/hidden", {
	title: __("Hidden"),
	icon: "hidden",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("hidden"), __("field")],
	edit: hiddenEdit,
	save: hiddenSave,
	attributes: {
		value: {
			type: "string",
			default: "",
		},
		label: {
			type: "string",
			default: "Email",
		},
		id: {
			type: "string",
			default: "",
		},
		field_name: {
			type: "string",
			default: "",
		},
		adminId: {
			type: "object",
			default: {
				default: "",
				value: "",
			},
		},
	},
	parent: fieldParents,
});
