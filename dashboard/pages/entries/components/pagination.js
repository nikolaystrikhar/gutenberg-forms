import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getEntries } from '../../../redux/actions/entries/getEntries';
import { get, isEqual } from 'lodash';
import { withRouter } from 'react-router-dom';

function Pagination(props) {
	const [currentPageValue, setCurrentPageValue] = useState(0);

	const entriesState = get(props, 'entries');
	const currentPage = get(entriesState, 'currentPage');
	const totalPages = get(entriesState, 'totalPages');
	const perPage = get(entriesState, 'perPage');
	const totalEntries = get(entriesState, 'totalEntries');
	const { hash, pathname, search } = props.location;

	useEffect(() => {
		setCurrentPageValue(currentPage);
	}, [currentPage]);

	const nextPage = () => {
		const nextIndex = Number(currentPage) + 1;

		if (!isNextPageDisabled()) {
			props.getEntries(nextIndex, {}, [], () => null, hash);
		}
	};

	const prevPage = () => {
		const prevIndex = Number(currentPage) - 1;

		if (!isPrevPageDisabled()) {
			props.getEntries(prevIndex, {}, [], () => null, hash);
		}
	};

	const isNextPageDisabled = () => {
		const nextIndex = Number(currentPage) + 1;

		return nextIndex > totalPages ? true : false;
	};
	const isPrevPageDisabled = () => {
		const prevIndex = Number(currentPage) - 1;

		return prevIndex <= 0 ? true : false;
	};

	const jumpToPage = (page) => {
		if (page > 0 && page <= totalPages && !isEqual(currentPage, page)) {
			props.getEntries(page, {}, [], () => null, hash);
		}
	};

	const handlePageInput = (event) => {
		const pageIndex = Number(event.target.value);

		if (pageIndex > 0 && pageIndex <= totalPages) {
			setCurrentPageValue(pageIndex);
			jumpToPage(pageIndex);
		}
	};

	return (
		<div className="cwp-pagination">
			<div className="tablenav-pages">
				<span className="displaying-num">{totalEntries} items</span>
				<span className="pagination-links">
					<span
						onClick={prevPage}
						className={`tablenav-pages-navspan button ${
							isPrevPageDisabled() ? 'disabled' : ''
						}`}
						aria-hidden="true"
					>
						‹
					</span>
					<span className="paging-input">
						<label
							htmlFor="current-page-selector"
							className="screen-reader-text"
						>
							Current Page
						</label>
						<input
							className="current-page"
							id="current-page-selector"
							type="number"
							name="paged"
							onChange={handlePageInput}
							size={1}
							value={currentPageValue}
							aria-describedby="table-paging"
						/>
						<span className="tablenav-paging-text">
							{' '}
							of <span className="total-pages">{totalPages}</span>
						</span>
					</span>
					<a
						onClick={nextPage}
						className={`next-page button ${
							isNextPageDisabled() ? 'disabled' : ''
						}`}
					>
						<span className="screen-reader-text">Next page</span>
						<span aria-hidden="true">›</span>
					</a>
				</span>
			</div>
		</div>
	);
}

const mapStateToProps = (state) => {
	const { entries } = state;
	return {
		entries,
	};
};

const mapDispatchToProps = {
	getEntries,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(Pagination));
