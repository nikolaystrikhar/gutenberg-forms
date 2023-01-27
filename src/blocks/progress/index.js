const { registerBlockType } = wp.blocks;

import metadata from './block.json';
import Icon from "../../block/Icon";
import edit from "./edit.js";
import deprecated from "./deprecated/deprecated";

registerBlockType( metadata, {
	icon: <Icon icon="progress" />,
	edit,
	deprecated,
});
