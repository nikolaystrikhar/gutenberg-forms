import { REMOVE_NOTICE } from '../types';

export const removeNotice = (id) => (dispatch) => {
	dispatch({
		type: REMOVE_NOTICE,
		payload: {
			id,
		},
	});
};
