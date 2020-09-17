/**
 * ? All extended features of gutenberg forms exposed to be used in the addons
 * ? will be imported here.
 */

import TagSelector from "../block/components/tagSelector";

function cwp_gf_select(scope) {
	switch (scope) {
		case "cwp/components":
			return {
				TagSelector,
			};
		default:
			return null;
	}
}

window.cwp_gf_select = cwp_gf_select;
