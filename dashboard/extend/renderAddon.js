import { get, set, clone } from 'lodash';
import { addonExist } from '../api/addons';
import { TEXT_DOMAIN } from '../contants';
const { addFilter, doAction } = wp.hooks;
const GlobalComponents = get(window, 'cwp_gf');
const { __ } = wp.i18n;

/**
 *
 * Will register a new addon for gutenberg forms
 * @param {string} slug - Addon Slug
 * @param {object} config - Addon Configurations
 * 
 * @example
 * 
 * 
  registerAddon("cwp_gf_report_entry_export_btn", {
    renderSlot: "entries.entry.details.footer.actions",
    render: () => <h1>HELLO WORLD</h1>,  
  });

 * 
 */

function registerAddon(slug, config) {
	if (typeof slug !== 'string') {
		console.error(__(`Addon Slug must be of type string.`, TEXT_DOMAIN));
	}

	if (typeof config !== 'object') {
		console.error(
			__(`Addon Config for ${slug} must be an object`, TEXT_DOMAIN)
		);
	}

	if (!'parent' in config || typeof config.parent !== 'string') {
		console.error(
			__(
				`Addon ${slug} must have a valid parent integration`,
				TEXT_DOMAIN
			)
		);
	}

	if (addonExist(slug)) {
		console.error(__(`Addon with slug ${slug} already exist`, TEXT_DOMAIN));
		return; // cannot execute code further due to duplication issue
	}

	const data = {
		slug,
		config,
	};

	addFilter(
		'cwp_gf.registerAddon',
		'cwp/gutenberg-forms/registerAddon',
		(addons) => {
			const newAddons = clone(addons);

			newAddons.push(data);
			return newAddons;
		}
	);

	doAction('cwp_gf.update_addons');
}

set(window, 'cwp_gf.extend.registerAddon', registerAddon);
