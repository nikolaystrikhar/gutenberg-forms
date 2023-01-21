const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;

import { attributes } from "./block.json";
import reusableEdit from "./edit";
import { deprecated } from "./deprecated/deprecated";

/**
 *
 * This block is used to display the server side render for the saved forms
 * instead of replacing the saved form with short code block
 * this block will be used
 *
 */

registerBlockType("cwp/reusable-form", {
	title: __("Existing Form", "forms-gutenberg"),
	icon: "index-card",
	category: "gutenberg-forms",
	keywords: [
		__("gutenberg-forms", "forms-gutenberg"),
		__("forms", "forms-gutenberg"),
		__("reusable", "forms-gutenberg"),
		__("reusable forms", "forms-gutenberg"),
		__("existing form", "forms-gutenberg"),
	],
	attributes,
	edit: reusableEdit,
	deprecated: deprecated,
});
