const { registerBlockType } = wp.blocks;

import metadata from './block.json';
import edit from "./edit";
import deprecated from "./deprecated/deprecated";

/**
 *
 * This block is used to display the server side render for the saved forms
 * instead of replacing the saved form with short code block
 * this block will be used
 *
 */

registerBlockType(metadata, {
	edit,
	deprecated: deprecated,
});
