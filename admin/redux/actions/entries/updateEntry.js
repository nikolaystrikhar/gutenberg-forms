import { UPDATE_ENTRY } from '../types';
import { get, findIndex, clone } from 'lodash';
import store from '../../store/store';

export const updateEntry = (updatedEntry) => (dispatch) => {
	const id = get(updatedEntry, 'id');
	const currentEntries = clone(store.getState().entries.data);

	// current entry index
	const idx = findIndex(currentEntries, { id });

	currentEntries.splice(idx, 1, updatedEntry);

	// now the entry is updated
	dispatch({
		type: UPDATE_ENTRY,
		payload: {
			updatedEntries: currentEntries,
		},
	});
};
