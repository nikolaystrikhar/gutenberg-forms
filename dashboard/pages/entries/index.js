import React, { useState, useRef, useEffect, Fragment } from 'react';
import Header from './components/main-header';
import BarChart from './components/bar-chart';
import EntriesTable from './components/entries-table';
import Pagination from './components/pagination';
import { withRouter } from 'react-router-dom';
import Entry from './subpages/entry/entry';
import FormEntries from './subpages/form-entries';
import { get, isEqual, startsWith } from 'lodash';
import { usePrevious } from '../../hooks/usePrevious';
import EntriesSummary from './subpages/entries-summary';

const $ = jQuery;

function Entries(props) {
	const [chart, setChart] = useState(true);
	const chartContainer = useRef();
	const { hash } = props.location;
	const hashBraces = hash.split('/');
	const lastHash = get(hashBraces, hashBraces.length - 1);
	const secondLastHash = get(hashBraces, hashBraces.length - 2);
	const lastPageHash = usePrevious(hash);

	const previewChartInFullScreen = () => {
		const currentWidth = $(window).width();

		// checking if this update is not because of the page change
		const notPageChanged = isEqual(hash, lastPageHash);

		if (chart && currentWidth < 600 && notPageChanged) {
			chartContainer.current.requestFullscreen();
		}
	};

	useEffect(previewChartInFullScreen, [chart]);

	if (hash === '#/entries') {
		return (
			<div className="cwp-entries-root">
				{chart && (
					<div className="chart-container" ref={chartContainer}>
						<BarChart />
					</div>
				)}

				<Header chart={chart} setChart={setChart} />
				<Pagination />
				<EntriesTable />
				<Pagination />
			</div>
		);
	} else if (
		isEqual(get(hashBraces, 1), 'entries') &&
		(startsWith(lastHash, 'post_slug=') || !isNaN(Number(lastHash)))
	) {
		return <Entry />;
	} else if (
		startsWith(lastHash, 'form-') &&
		!startsWith(secondLastHash, 'summary')
	) {
		return <FormEntries />;
	} else if (startsWith(secondLastHash, 'summary')) {
		return <EntriesSummary />;
	} else {
		return null;
	}
}

export default withRouter(Entries);
