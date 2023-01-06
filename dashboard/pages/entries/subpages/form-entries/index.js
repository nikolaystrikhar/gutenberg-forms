import React, { useState, useEffect } from 'react';
import { extractFormId, extract_fields } from '../../utils';
import { withRouter } from 'react-router-dom';
import FormEntriesTable from './components/form-entries-table';
import FormDetails from './components/form-details';
import Pagination from '../../components/pagination';
import MainHeader from '../../components/main-header';
import AdvancedFilter from '../../components/advanced-filters';
import { connect } from 'react-redux';
import { get, set, clone, isEmpty } from 'lodash';
import { TEXT_DOMAIN } from '../../../../contants';

const { __ } = wp.i18n;

function FormEntries(props) {
	const { hash } = props.location;
	const { entries } = props;

	const [screenOptions, setScreenOptions] = useState({
		columns: {},
		enabled: false,
	});

	const toggleAdvancedFilters = () => {
		const newScreenOptions = clone(screenOptions);
		const enabled = get(newScreenOptions, 'enabled');

		set(newScreenOptions, 'enabled', !enabled);

		setScreenOptions(newScreenOptions);
	};

	const crumbs = [
		{
			label: __('Entries', TEXT_DOMAIN),
			link: '#/entries',
		},
		{
			label: __('Form Entries', TEXT_DOMAIN),
			link: hash,
		},
	];

	return (
		<div className="form-entries-root cwp-entries-root">
			<FormDetails />
			<MainHeader
				export_entries={true}
				toggleAdvancedFilters={toggleAdvancedFilters}
				advancedFilter={true}
				showChart={false}
				header={false}
				screenOptions={screenOptions}
				searchFilter={false}
			/>
			{screenOptions.enabled &&
				!entries.loading &&
				!entries.error &&
				!isEmpty(entries.data) && (
					<AdvancedFilter
						screenOptions={screenOptions}
						setScreenOptions={setScreenOptions}
					/>
				)}
			<Pagination />
			<FormEntriesTable
				screenOptions={screenOptions}
				setScreenOptions={setScreenOptions}
				form_id={extractFormId(hash)}
			/>
			<Pagination />
		</div>
	);
}

const mapStateToProps = (state) => {
	const { entries } = state;

	return {
		entries,
	};
};

export default connect(mapStateToProps, null)(withRouter(FormEntries));
