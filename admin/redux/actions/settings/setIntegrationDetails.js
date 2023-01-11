import {
	SET_INTEGRATION_DETAILS,
	SETTINGS_DONE,
	SETTINGS_SAVING,
	SETTINGS_SAVED,
} from '../types';
import { each } from 'lodash';

export const setIntegrationDetails =
	(fields, integrationName) => (dispatch) => {
		let queries = {};

		each(fields, (field, key) => {
			const query_key = 'cwp__' + integrationName + '__' + key;

			queries[query_key] = field.value;
		});

		dispatch({
			type: SETTINGS_SAVING,
		});

		const model = new wp.api.models.Settings({
			...queries,
		});

		model.save().then((response) => {
			const payload = {
				fields,
				integrationName,
			};

			dispatch({
				type: SET_INTEGRATION_DETAILS,
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
