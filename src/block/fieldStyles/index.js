import { each } from "lodash";
const { registerBlockStyle } = wp.blocks;

let fieldStyles = [
	{
		name: "inline",
		label: "Inline"
	}
];

export function registerFieldStyles(fields) {
	let prefix = "cwp/"; // our block prefix

	each(fields, field => {
		let slug = prefix.concat(field); // example => "cwp/name"

		registerBlockStyle(slug, fieldStyles); //registering style with the specified field slug
	});
}
