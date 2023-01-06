import {
	SAVE_SETTINGS,
	SETTINGS_SAVING,
	SETTINGS_SAVED,
	SETTINGS_DONE,
} from '../types';
import store from '../../store/store';

export const saveSettings = () => (dispatch) => {
	const general_settings_key = 'cwp_gutenberg_forms_general_settings';

	const { generalSettings } = store.getState();

	const model = new wp.api.models.Settings({
		[general_settings_key]: JSON.stringify(generalSettings),
	});

	dispatch({
		type: SAVE_SETTINGS,
	});

	dispatch({
		type: SETTINGS_SAVING,
	});

	model.save().then((response) => {
		dispatch({
			type: SETTINGS_SAVED,
		});

		setTimeout(() => {
			dispatch({
				type: SETTINGS_DONE,
			});
		}, 1000);
	});
};
