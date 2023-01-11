import {
	ENTRIES_FETCHED,
	ENTRIES_FETCHING,
	ENTRIES_FETCH_FAILED,
	UPDATE_ENTRY,
	SET_ENTRIES_REFETCHING_STATUS,
} from '../actions/types';

const initialState = {
	filters: {},
	data: [],
	loading: false,
	error: false,
	totalPages: 0,
	currentPage: 0,
	perPage: 10,
	totalEntries: 0,
	refetchingStatus: true,
	entriesFetchedHash: '',
};

export default function (state = initialState, action) {
	switch (action.type) {
		case ENTRIES_FETCHING: {
			return {
				...state,
				loading: true,
				error: false,
			};
		}

		case ENTRIES_FETCHED: {
			return {
				...state,
				loading: false,
				error: false,
				data: action.payload.data,
				totalPages: action.payload.totalPages,
				currentPage: action.payload.currentPage,
				totalEntries: action.payload.totalEntries,
				filters: action.payload.filters,
				entriesFetchedHash: action.payload.hash,
			};
		}

		case ENTRIES_FETCH_FAILED: {
			return {
				...state,
				loading: false,
				error: true,
			};
		}

		case UPDATE_ENTRY: {
			return {
				...state,
				data: action.payload.updatedEntries,
			};
		}

		case SET_ENTRIES_REFETCHING_STATUS: {
			return {
				...state,
				refetchingStatus: action.payload.status,
			};
		}

		default:
			return state;
	}
}
