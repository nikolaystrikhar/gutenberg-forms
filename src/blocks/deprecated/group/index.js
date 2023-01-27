const { registerBlockType } = wp.blocks;

import metadata from './block.json';
import edit from "./edit.js";
import deprecated from "./deprecated/deprecated";

registerBlockType( metadata, {
	edit,
	deprecated,
} );