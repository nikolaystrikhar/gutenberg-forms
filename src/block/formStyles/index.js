import { __ } from '@wordpress/i18n';
import { each } from "lodash";
const { registerBlockStyle } = wp.blocks;

const formStyles = [
	{
		name: "paper",
		label: __("Paper", "cwp-gutenberg-forms"),
	}
];

export let applyFormStyles = slug => {
	each(formStyles, style => {
		registerBlockStyle(slug, style); //?iterating through each style & registering it
	});
};
