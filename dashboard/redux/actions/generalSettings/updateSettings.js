import { UPDATE_SETTINGS } from '../types';

export const updateSettings = (newSettings) => (dispatch) => {
	dispatch({
		type: UPDATE_SETTINGS,
		payload: {
			newSettings,
		},
	});
};
