import { each, isEqual } from "lodash";
const { registerBlockStyle } = wp.blocks;

let fieldStyles = [
	{
		name: "inline",
		label: "Inline"
	}
];

const radioFieldStyling = [
	{
		name: "button",
		label: "Button"
	}
];

export function registerFieldStyles(fields) {
	let prefix = "cwp/"; // our block prefix

	each(fields, field => {
		let slug = prefix.concat(field); // example => "cwp/name"

		if (isEqual(slug, "cwp/checkbox") || isEqual(slug, "cwp/radio"))
			registerBlockStyle(slug, radioFieldStyling);
		// styling only for radio and checkbox fields
		else registerBlockStyle(slug, fieldStyles); //registering style with the specified field slug
	});
}
