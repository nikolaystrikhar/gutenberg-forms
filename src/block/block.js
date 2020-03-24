import "./editor.scss";
import "./style.scss";

import { applyFormStyles } from "./formStyles/index";
import { registerFieldStyles } from "./fieldStyles/index";

const myAttrs = [
	"email",
	"name",
	"message",
	"checkbox",
	"datepicker",
	"radio",
	"phone",
	"website",
	"text",
	"select",
	"number",
	"yes-no"
];

applyFormStyles("cwp/block-gutenberg-forms"); //registering styles
registerFieldStyles(myAttrs); //registering field styles
