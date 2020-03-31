import { each } from "lodash";
const { registerBlockStyle } = wp.blocks;

const formStyles = [
	{
		name: "paper",
		label: "Paper"
	}
];

export let applyFormStyles = slug => {
	each(formStyles, style => {
		registerBlockStyle(slug, style); //?iterating through each style & registering it
	});
};
