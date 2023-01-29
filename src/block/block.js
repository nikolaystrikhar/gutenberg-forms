import "./editor.scss";
import "./style.scss";

import { applyFormStyles } from "./formStyles/index";
import { registerFieldStyles } from "./fieldStyles/index";
import { fieldBlockNames } from "../constants";

applyFormStyles("cwp/block-gutenberg-forms"); //registering styles
registerFieldStyles(fieldBlockNames); //registering field styles
