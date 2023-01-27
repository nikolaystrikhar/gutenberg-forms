const { registerBlockType } = "@wordpress/blocks"

import metadata from './block.json';
import edit from "./edit.js";
import deprecated from "./deprecated/deprecated";

// Child block for the form-column block for creating layouts

registerBlockType(metadata, {
	edit,
	deprecated,
});
