const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import { fieldParents } from '../../constants';

import fileUploadEdit from "./edit.js";
import fileUploadSave from "./save.js";

registerBlockType("cwp/file-upload", {
	title: __("File"),
	icon: 'media-document',
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("file"), __("file upload")],
	edit: fileUploadEdit,
	save: fileUploadSave,
	attributes: {
		enableCondition: {
			type: "boolean",
			default: false
		},
		file: {
			type: "string",
			default: ""
		},
		isRequired: {
			type: "boolean",
			default: false
		},
		label: {
			type: "string",
			default: "Select File"
		},
		id: {
			type: "string",
			default: ""
		},
		field_name: {
			type: "string",
			default: ""
		},
		messages: {
			type: "object",
			default: {
				empty: "Please select a file",
				invalid: "The file {{value}} is not valid!"
			}
		},
		condition: {
			type: "object",
			default: {
				field: null,
				condition: "===",
				value: ""
			}
		},
		requiredLabel: {
			type: "string",
			default: "*"
		},
		allowedFormats: {
			type: "string",
			default: [
				"jpg",
				"jpeg",
				"png",
				"gif",
				"pdf",
				"doc",
				"docx",
				"ppt",
				"pptx",
				"odt",
				"avi",
				"ogg",
				"m4a",
				"mov",
				"mp3",
				"mp4",
				"mpg",
				"wav",
				"wmv"
			]
		},
		adminId: {
			type: "object",
			default: {
				default: "",
				value: ""
			}
		}
	},
	supports: {
		align: true,
		align: ["wide", "full", "center"]
	},
	parent: fieldParents
});
