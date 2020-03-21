const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import { fieldParents } from '../../constants';
import formButtonEdit from "./edit.js";
import formButtonSave from "./save.js";


registerBlockType("cwp/form-button", {
	title: __("Form Button"),
	icon: __(
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			role="img"
			aria-hidden="true"
			focusable="false"
		>
			<path d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z"></path>
		</svg>
	),
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("button")],
	edit: formButtonEdit,
	save: formButtonSave,
	attributes: {
		label: {
			type: "string",
			default: "Submit"
		},
		parentId: {
			type: "string",
			default: ""
		},
		action: {
			default: "submit",
			type: "string"
		},
		styling: {
			type: "object",
			default: {
				backgroundColor: "rgb(238, 238, 238)",
				color: "rgb(49, 49, 49)",
				padding: 25
			}
		}
	},
	supports: {
		align: true,
		align: ["wide", "full", "center"]
	},
	parent: fieldParents
});
