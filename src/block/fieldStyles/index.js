import { __ } from '@wordpress/i18n';
import { each, isEqual } from "lodash";
const { registerBlockStyle } = wp.blocks;

let fieldStyles = [
	{
		name: "inline",
		label: __("Inline", "forms-gutenberg"),
	}
];

const radioFieldStyling = [
	{
		name: "button",
		label: __("Button", "forms-gutenberg"),
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
