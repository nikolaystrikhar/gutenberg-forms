import { SET_ENTRIES_REFETCHING_STATUS } from '../types';

export const setRefetchingStatus = (status) => (dispatch) => {
	dispatch({
		type: SET_ENTRIES_REFETCHING_STATUS,
		payload: {
			status,
		},
	});
};
