/**
 * Gutenberg Blocks
 *
 * All blocks related JavaScript files should be imported here.
 * You can create a new block folder in this dir and include code
 * for that block here as well.
 *
 * All blocks should be included here since this is the file that
 * Webpack is compiling as the input file.
 */

import "./block/block.js";

/**
 * Main Gutenberg Forms block
 */
import "./blocks/gutenberg-forms/index.js";

/**
 * Inner blocks
 */

import "./blocks/reusable_forms/index.js";
import "./blocks/text/index.js";
import "./blocks/number/index.js";
import "./blocks/checkbox/index.js";
import "./blocks/select/index.js";
import "./blocks/datepicker/index.js";
import "./blocks/message/index.js";
import "./blocks/email/index.js";
import "./blocks/form-button/index.js";
import "./blocks/name/index.js";
import "./blocks/phone/index.js";
import "./blocks/radio/index.js";
import "./blocks/website/index.js";
import "./blocks/yes-no/index.js";
import "./blocks/hidden/index.js";
import "./blocks/file_upload/index.js";
import "./blocks/progress/index.js";
import "./blocks/form-calculation/index.js";
import "./blocks/column/index.js";
import "./blocks/form-column/index.js";
import "./blocks/form-group/index.js";

import "./blocks/form-steps/root/index.js";
import "./blocks/form-steps/childs/form-step/index.js";

/**
 * extended index
 */

import "./extend/index.js";
