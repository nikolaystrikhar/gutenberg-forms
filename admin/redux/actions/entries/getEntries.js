import {
	ENTRIES_FETCHED,
	ENTRIES_FETCHING,
	ENTRIES_FETCH_FAILED,
} from '../types';
import axios from 'axios';
import { get, omit } from 'lodash';
import { httpQuery } from '../../../functions';
import store from '../../store/store';

const rest_url = get(window, 'cwp_global.rest_url');

export const getEntries =
	(
		currentPage, // current page index to be fetched
		queryFilters = {}, // filters that will be assigned when fetching the entries
		omitFilters = [], // filters that will be omitted when fetching the entries
		callback = () => null, // callback on success,
		hash = '' // currentPage Hash
	) =>
	(dispatch) => {
		const entriesState = store.getState().entries;
		const perPage = get(entriesState, 'perPage');
		const stateFilters = get(entriesState, 'filters');
		const currentPageInState = get(entriesState, 'currentPage');

		let filters = {
			...stateFilters,
			...queryFilters,
			page: currentPage === null ? currentPageInState : currentPage,
			per_page: perPage,
		};

		filters = omit(filters, omitFilters);

		const filters_query = httpQuery(filters);

		// temp fix.
		let proxy;
		if ( rest_url.includes( 'wp-json' ) ) {
			proxy = rest_url.concat(`wp/v2/cwp_gf_entries?${filters_query}`);
		} else {
			proxy = rest_url.concat(`wp/v2/cwp_gf_entries&${filters_query}`);
		}

		dispatch({
			type: ENTRIES_FETCHING,
		});

		axios
			.get(proxy)
			.then((response) => {
				const totalPages = get(response.headers, 'x-wp-totalpages');
				const totalEntries = get(response.headers, 'x-wp-total');
				const { data = [] } = response;

				dispatch({
					type: ENTRIES_FETCHED,
					payload: {
						data,
						totalPages,
						currentPage: currentPage === null ? currentPageInState : currentPage,
						totalEntries,
						filters,
						hash,
					},
				});

				callback(data);
			})
			.catch((error) => {
				dispatch({
					type: ENTRIES_FETCH_FAILED,
				});
			});
	};
