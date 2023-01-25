const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;

import { fieldParents } from "../../constants";
import { title, attributes } from "./block.json";
import formButtonEdit from "./edit.js";
import { deprecated } from "./deprecated/deprecated";

registerBlockType("cwp/form-button", {
	title: __(title, "forms-gutenberg"),
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
	, "forms-gutenberg"),
	// TODO duplicated key align
	supports: {
		align: true,
		align: ["left", "center", "right"],
	},
	category: "gutenberg-forms",
	keywords: [__("gutenberg-forms", "forms-gutenberg", "forms-gutenberg"), __("forms", "forms-gutenberg", "forms-gutenberg"), __("button", "forms-gutenberg", "forms-gutenberg")],
	attributes,
	edit: formButtonEdit,
	parent: fieldParents,
	deprecated: deprecated,
});
