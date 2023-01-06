import {
	SET_INTEGRATION,
	SETTINGS_SAVING,
	SETTINGS_SAVED,
	SETTINGS_DONE,
} from '../types';

export const setIntegration = (integrationName, query) => (dispatch) => {
	//where query is weather to enable or disable integration

	const integration_key = 'cwp__enable__'.concat(integrationName);
	const model = new wp.api.models.Settings({
		[integration_key]: query,
	});

	dispatch({
		type: SETTINGS_SAVING,
	});

	model.save().then((response) => {
		const payload = {
			[integration_key]: response[integration_key],
			integrationName,
			query,
		};

		dispatch({
			type: SET_INTEGRATION,
			payload,
		});

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
