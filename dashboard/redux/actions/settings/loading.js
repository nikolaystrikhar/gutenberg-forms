import { SETTINGS_SAVED, SETTINGS_SAVING } from '../types';

export const setSettingsStatus = (fetching) => (dispatch) => {
	const type = fetching ? SETTINGS_SAVING : SETTINGS_SAVED;

	dispatch({
		type,
	});
};
