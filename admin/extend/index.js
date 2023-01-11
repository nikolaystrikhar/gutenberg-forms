/**
 *  EXTEND FEATURES
 *  This directory is responsible for managing all the dashboard features that can be extended
 *  by using Addons / Integrations
 *
 *  This extend object is formatted by their respected pages and their sub-page then
 *  their respective components
 */

import { SlotFillCreator } from './SlotFillCreator';
import { set, get, each } from 'lodash';
const availableIntegrations = get(cwp_global, 'settings.integrations');

export const extend = {
	dashboard: {
		cards: {},
	},
	entries: {
		entry: {
			details: {
				footer: {
					actions: SlotFillCreator(
						'entries_entry_details_footer_actions'
					),
					links: SlotFillCreator(
						'entries_entry_details_footer_links'
					),
				},
			},
		},
	},
	settings: {
		integrations: {
			fields: {},
		},
	},
};

each(availableIntegrations, (_, name) => {
	extend['settings']['integrations']['fields'][name] = SlotFillCreator(
		`settings_integrations_${name}_fields`
	);
});

set(window, 'cwp_gf.extend', extend);
