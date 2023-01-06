import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getEntries } from '../../../../../redux/actions/entries/getEntries';
import { get, map, isEmpty, capitalize, assign } from 'lodash';
import {
	extract_fields,
	linkify,
	truncateText,
	match_entry_fields,
} from '../../../utils';
import { TEXT_DOMAIN } from '../../../../../contants';
import { withRouter, NavLink } from 'react-router-dom';
import { Spinner, Button, IconButton, Icon } from '@wordpress/components';
import { timeSince } from '../../../../../functions';
import { setRefetchingStatus } from '../../../../../redux/actions/entries/setRefetchingStatus';
const { __ } = wp.i18n;

function FormEntriesTable(props) {
	const { hash } = props.location;
	const {
		entries,
		entries: { refetchingStatus },
		form_id = null,
		screenOptions,
		setScreenOptions,
	} = props;
	const entriesData = entries.data;

	const defaultLocation = {
		pathname: props.location.pathname,
		search: props.location.search,
	};
	const colSpan = 1;

	const updateColumns = (data) => {
		let initialColumns = {};
		const fields = extract_fields(data, screenOptions.columns);

		fields.forEach((field) => {
			initialColumns[field] = true;
		});

		assign(initialColumns, screenOptions.columns);

		setScreenOptions({
			...screenOptions,
			columns: initialColumns,
		});
	};

	useEffect(() => {
		if (refetchingStatus) {
			props.getEntries(
				1,
				{
					form_id,
				},
				['search', 'entry_status'],
				updateColumns,
				'#/entries/'.concat(form_id)
			);
		} else {
			setRefetchingStatus(true);
		}
	}, []);

	useEffect(() => {
		if (refetchingStatus) {
			props.getEntries(
				1,
				{
					form_id,
				},
				['search', 'entry_status'],
				updateColumns,
				'#/entries/'.concat(form_id)
			);
		} else {
			setRefetchingStatus(true);
		}
	}, [hash]);

	const tableHeads = map(
		extract_fields(entriesData, screenOptions.columns),
		(label, idx) => {
			return (
				<th
					colSpan={colSpan}
					key={idx}
					scope="col"
					className="manage-column column-name column-primary"
				>
					{__(label, TEXT_DOMAIN)}
				</th>
			);
		}
	);

	return (
		<div className="form-entries-table cwp-entries-root">
			<table className="wp-list-table widefat plugins striped cwp-entries-table">
				<thead>
					{!entries.loading && !entries.error && (
						<tr>
							{tableHeads}
							<th colSpan={colSpan} className="date">
								{__('Date', TEXT_DOMAIN)}
							</th>
							<th colSpan={colSpan} className="status">
								{__('Status', TEXT_DOMAIN)}
							</th>
							<th colSpan={colSpan} className="actions">
								{__('Actions', TEXT_DOMAIN)}
							</th>
						</tr>
					)}
				</thead>
				{entries.loading && !entries.error && (
					<td className="cwp-entries-prompt" colSpan={5}>
						<div className="content">
							<span>{__('Loading Entries', TEXT_DOMAIN)}</span>
							<Spinner />
						</div>
					</td>
				)}
				{!entries.loading && entries.error && (
					<td className="cwp-entries-prompt" colSpan={5}>
						<div className="content">
							<span>
								{__('Failed to fetch Entries!', TEXT_DOMAIN)}
							</span>
							<Button
								isLink
								onClick={() => props.getEntries(currentPage)}
							>
								{__('Try Again', TEXT_DOMAIN)}
							</Button>
						</div>
					</td>
				)}
				{!entries.loading && !entries.error && isEmpty(entriesData) && (
					<td className="cwp-entries-prompt" colSpan={5}>
						<div className="content">
							<span>{__('No Entries Found!', TEXT_DOMAIN)}</span>
						</div>
					</td>
				)}
				{!entries.loading && !entries.error && !isEmpty(entriesData) && (
					<tbody id="the-list">
						{map(entriesData, (entriesData, index) => {
							const extra = get(entriesData, 'entry_extra');
							const entry_id = get(entriesData, 'id');
							const entry_fields = get(
								entriesData,
								'entry_fields'
							);
							const status = get(entriesData, 'entry_status');
							const date = get(entriesData, 'date');

							return (
								<tr>
									{map(
										match_entry_fields(
											entries.data,
											entry_fields,
											screenOptions.columns
										),
										(field_value, field_name) => {
											const cellLabel = `<strong className="field-title">${field_name}: </strong>`;
											const cellValue =
												cellLabel +
												truncateText(field_value, 30);

											return (
												<td
													colSpan={colSpan}
													className="plugin-title column-primary"
													dangerouslySetInnerHTML={{
														__html: isEmpty(
															cellValue
														)
															? '-'
															: cellValue,
													}}
												></td>
											);
										}
									)}
									<td colSpan={colSpan} className="date">
										<strong className="field-title">
											Date:{' '}
										</strong>
										{timeSince(new Date(date))}
									</td>
									<td colSpan={colSpan} className="status">
										<strong className="field-title">
											Status:{' '}
										</strong>
										<Button
											onClick={() =>
												props.getEntries(1, {
													entry_status: status,
												})
											}
											isLink
										>
											{capitalize(status)}
										</Button>
									</td>
									<td
										colSpan={colSpan}
										className="column-actions actions"
									>
										<strong className="field-title">
											Actions:{' '}
										</strong>
										<NavLink
											to={{
												...defaultLocation,
												hash: '#/entries/'.concat(
													entry_id
												),
											}}
										>
											<IconButton
												icon="visibility"
												label={__(
													'View Entry',
													TEXT_DOMAIN
												)}
											/>
										</NavLink>
									</td>
								</tr>
							);
						})}
					</tbody>
				)}
				<tfoot>
					{!entries.loading && !entries.error && (
						<tr>
							{tableHeads}
							<th colSpan={colSpan} className="date">
								{__('Date', TEXT_DOMAIN)}
							</th>
							<th colSpan={colSpan} className="status">
								{__('Status', TEXT_DOMAIN)}
							</th>
							<th colSpan={colSpan} className="actions">
								{__('Actions', TEXT_DOMAIN)}
							</th>
						</tr>
					)}
				</tfoot>
			</table>
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
	setRefetchingStatus,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(FormEntriesTable));
