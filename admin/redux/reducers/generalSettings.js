import { UPDATE_SETTINGS, SAVE_SETTINGS } from '../actions/types';
import { get } from 'lodash';

const generalSettings = get(cwp_global, 'general');
const initialState = {
	...generalSettings,
};

export default function (state = initialState, action) {
	switch (action.type) {
		case UPDATE_SETTINGS:
			return {
				...state,
				...action.payload.newSettings,
			};

		case SAVE_SETTINGS:
			return {
				...state,
			};

		default:
			return {
				...state,
			};
	}
}
