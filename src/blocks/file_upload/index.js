const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import { fieldParents } from "../../constants";

import fileUploadEdit from "./edit.js";
import fileUploadSave from "./save.js";

import blockData from "./block.json";

const { title, attributes } = blockData;

registerBlockType("cwp/file-upload", {
	title: __(title),
	icon: "media-document",
	category: "gutenberg-forms",
	keywords: [__("gutenberg-forms"), __("forms"), __("file"), __("file upload")],
	edit: fileUploadEdit,
	save: fileUploadSave,
	attributes,
	supports: {
		align: true,
		align: ["wide", "full", "center"],
	},
	parent: fieldParents,
});
