import {
	ADD_NOTICE,
	REMOVE_NOTICE,
	REMOVE_SIMILAR_NOTICES,
} from '../actions/types';
import { isEqual, clone, uniqBy } from 'lodash';

const initialState = {
	data: [],
};

export default function (state = initialState, action) {
	switch (action.type) {
		case ADD_NOTICE: {
			let newState = clone(state);
			newState.data.push(action.payload.notice);
			return newState;
		}
		case REMOVE_NOTICE: {
			let newState = clone(state);
			newState.data = newState.data.filter(
				(notice) => !isEqual(notice.id, action.payload.id)
			);
			return newState;
		}

		case REMOVE_SIMILAR_NOTICES: {
			let newState = clone(state);

			newState.data = uniqBy(newState.data, 'uniqueKey'); // creating a unique notices data

			return newState;
		}

		default:
			return state;
	}
}
