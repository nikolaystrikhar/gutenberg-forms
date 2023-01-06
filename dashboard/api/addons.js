import { isEqual } from 'lodash';
const { applyFilters } = wp.hooks;

/**
 * Will check if the addon is available in the registered addons list
 * @param   {string}          slug of the addons
 * @return  {boolean}         existence
 */

export const addonExist = (slug) => {
	const addonsList = applyFilters('cwp_gf.registerAddon', []);
	const requiredAddon = addonsList.filter((addon) =>
		isEqual(addon.slug, slug)
	);

	return requiredAddon.length !== 0 ? true : false;
};
