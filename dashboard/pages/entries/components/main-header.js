import React, { useState, useEffect } from 'react';
import { TEXT_DOMAIN } from '../../../contants';
import { Icon, IconButton } from '@wordpress/components';
import { connect } from 'react-redux';
import { getEntries as getEntriesAction } from '../../../redux/actions/entries/getEntries';
import { get, isEqual, isEmpty } from 'lodash';
import { withRouter } from 'react-router-dom';
import Export from './export';

const { __ } = wp.i18n;
const { Button, ButtonGroup } = wp.components;
const $ = jQuery;

function MainHeader({
	chart,
	setChart,
	getEntries,
	entries,
	location,
	showChart = true,
	header = true,
	searchFilter = true,
	advancedFilter = false,
	toggleAdvancedFilters,
	screenOptions = {},
	export_entries = false,
}) {
	const [currentStatus, setCurrentStatus] = useState('all');
	const [search, setSearch] = useState('');
	const updatedStatus = get(entries, 'filters.entry_status');
	const currentHash = get(location, 'hash');

	useEffect(() => {
		if (isEmpty(updatedStatus)) return;

		setCurrentStatus(updatedStatus);
	}, [updatedStatus]);

	const chartEnabled = chart
		? {
				isDefault: true,
		  }
		: {
				isPrimary: true,
		  };

	const applyStatusFilter = (status) => {
		if (status !== 'all') {
			getEntries(1, {
				entry_status: status,
			});
		} else {
			getEntries(1, {}, ['entry_status']);
		}

		setCurrentStatus(status);
	};

	const getEnabledStatusIndication = (status) => {
		if (isEqual(currentStatus, status)) {
			return {
				isPrimary: true,
			};
		}

		return {
			isDefault: true,
		};
	};

	const handleSearch = (event) => {
		const value = event.target.value;

		if (event.key !== 'Enter') return;

		if (isEmpty(value)) {
			getEntries(1, null, ['search']);
		} else {
			getEntries(1, {
				search: value,
			});
		}
	};

	const handleChart = () => {
		setChart(!chart);
	};

	return (
		<div className="cwp-entries-main-header">
			<div className="cwp-head">
				{header && <h2>All Form Entries</h2>}
				{showChart && (
					<div>
						<Button
							onClick={() => handleChart(!chart)}
							{...chartEnabled}
						>
							{__(
								chart ? 'Hide Chart' : 'Show Chart',
								TEXT_DOMAIN
							)}{' '}
							<Icon
								style={{ marginLeft: 10 }}
								icon={chart ? 'hidden' : 'chart-bar'}
							/>
						</Button>
					</div>
				)}
			</div>
			<div className="cwp-foot">
				<ButtonGroup>
					<Button
						{...getEnabledStatusIndication('all')}
						onClick={() => applyStatusFilter('all')}
					>
						All
					</Button>
					<Button
						{...getEnabledStatusIndication('read')}
						onClick={() => applyStatusFilter('read')}
					>
						Read
					</Button>
					<Button
						{...getEnabledStatusIndication('unread')}
						onClick={() => applyStatusFilter('unread')}
					>
						Unread
					</Button>
				</ButtonGroup>
				<div className="extra-filters">
					{searchFilter && (
						<input
							type="text"
							onKeyDown={handleSearch}
							onChange={(e) => setSearch(e.target.value)}
							value={search}
							className="cwp-search-entries"
							placeholder={__(
								'Search & hit Enter...',
								TEXT_DOMAIN
							)}
						/>
					)}
					{export_entries && <Export />}
					{advancedFilter &&
						!entries.loading &&
						!entries.error &&
						!isEmpty(entries.data) && (
							<IconButton
								icon={
									get(screenOptions, 'enabled')
										? 'arrow-down'
										: 'filter'
								}
								isDefault
								onClick={toggleAdvancedFilters}
								label={__('Advanced Filters', TEXT_DOMAIN)}
							/>
						)}
				</div>
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
	getEntries: getEntriesAction,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(MainHeader));
