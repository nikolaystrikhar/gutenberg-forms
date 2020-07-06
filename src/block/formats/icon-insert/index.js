import { TEXT_DOMAIN } from "../../constants";
import edit from "./edit";

const { __ } = wp.i18n;
const name = "cwp/icon-insert";

export const iconInsert = {
	name,
	title: __("Icon", TEXT_DOMAIN),
	className: "iconify",
	tagName: "span",
	attributes: {
		data: "data-icon",
		style: "style",
	},
	edit,
};
