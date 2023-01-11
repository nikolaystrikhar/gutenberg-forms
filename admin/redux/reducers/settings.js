import {
	SET_INTEGRATION,
	SETTINGS_SAVING,
	SETTINGS_SAVED,
	SETTINGS_DONE,
	SET_INTEGRATION_DETAILS,
} from '../actions/types';

import { set } from 'lodash';

const settings = cwp_global.settings;

const initialState = {
	...settings,
	loading: '',
	authenticating: false,
};

export default function (state = initialState, action) {
	switch (action.type) {
		case SET_INTEGRATION:
			const {
				payload: { integrationName, query },
			} = action;

			state.integrations[integrationName] = {
				...state.integrations[integrationName],
				enable: query,
			};

			return {
				...state,
			};

		case SET_INTEGRATION_DETAILS:
			// const { payload: { integrationName, fields } } = action;

			// state.integrations[integrationName].fields = fields;

			return {
				...state,
			};

		case SETTINGS_SAVING:
			return {
				...state,
				loading: SETTINGS_SAVING,
			};

		case SETTINGS_SAVED:
			return {
				...state,
				loading: SETTINGS_SAVED,
			};

		case SETTINGS_DONE:
			return {
				...state,
				loading: '',
			};

		default:
			return state;
	}
}
