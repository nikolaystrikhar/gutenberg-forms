import { ADD_NOTICE, REMOVE_NOTICE, REMOVE_SIMILAR_NOTICES } from '../types';
import { makeid } from '../../../functions';
import { set } from 'lodash';

export const addNotice = (notice) => (dispatch) => {
	set(notice, 'id', 'notice-' + makeid(10));

	dispatch({
		type: ADD_NOTICE,
		payload: {
			notice,
		},
	});

	dispatch({
		type: REMOVE_SIMILAR_NOTICES,
	});
};
