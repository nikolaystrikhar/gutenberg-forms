const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import reusableEdit from "./edit";
import reusableSave from "./save";
import blockData from "./block.json";

const { attributes } = blockData;

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
		__("gutenberg-forms"),
		__("forms"),
		__("reusable"),
		__("reusable forms"),
		__("existing form"),
	],
	attributes,
	edit: reusableEdit,
	save: reusableSave,
});
