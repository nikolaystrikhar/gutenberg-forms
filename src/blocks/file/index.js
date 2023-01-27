const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;

import { title, attributes } from "./block.json";
import fileUploadEdit from "./edit.js";
import { fieldParents } from "../../constants";
import { deprecated } from "./deprecated/deprecated";

registerBlockType("cwp/file-upload", {
	title: __(title, "forms-gutenberg"),
	icon: "media-document",
	supports: {
		align: ["wide", "full", "center"],
	},
	category: "gutenberg-forms",
	keywords: [__("gutenberg-forms", "forms-gutenberg"), __("forms", "forms-gutenberg"), __("file", "forms-gutenberg"), __("file upload", "forms-gutenberg")],
	attributes,
	edit: fileUploadEdit,
	parent: fieldParents,
	deprecated: deprecated,
});
