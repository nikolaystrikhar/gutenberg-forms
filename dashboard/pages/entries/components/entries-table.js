import React, { useEffect, Fragment } from 'react';
import { Icon, Spinner, IconButton, ExternalLink } from '@wordpress/components';
import { getEntries } from '../../../redux/actions/entries/getEntries';
import { connect } from 'react-redux';
import { map, get, isEmpty, isEqual, capitalize } from 'lodash';
import { timeSince } from '../../../functions';
import { TEXT_DOMAIN } from '../../../contants';
import { NavLink, withRouter } from 'react-router-dom';
import { setRefetchingStatus } from '../../../redux/actions/entries/setRefetchingStatus';
const { Button } = wp.components;
const { __ } = wp.i18n;

/**
 * This Table will only show entries with their form name
 */

function EntriesTable(props) {
	const { hash, pathname, search } = props.location;

	const entriesState = props.entries;
	const data = entriesState.data || [];
	const currentPage = get(entriesState, 'currentPage');

	const defaultLocation = {
		pathname,
		search,
	};

	useEffect(() => {
		const { refetchingStatus } = entriesState;

		if (refetchingStatus) {
			props.getEntries(
				1,
				null,
				['search', 'form_id'],
				() => null,
				'#/entries'
			);
		} else {
			props.setRefetchingStatus(true);
		}
	}, []);

	return (
		<div className="cwp-entries-table">
			<table className="wp-list-table widefat plugins striped">
				<thead>
					<tr>
						<th
							scope="col"
							id="form"
							className="manage-column column-name column-primary"
						>{__('Form', TEXT_DOMAIN)}</th>
						<th
							scope="col"
							id="status"
							className="manage-column column-primary"
						>{__('Status', TEXT_DOMAIN)}
						</th>
						<th
							scope="col"
							id="date"
							className="manage-column column-primary"
						>
							{__('Date', TEXT_DOMAIN)}
						</th>
						<th
							scope="col"
							id="actions"
							className="manage-column column-primary"
						>
							{__('Actions', TEXT_DOMAIN)}
						</th>
					</tr>
				</thead>
				<tbody id="the-list">
					{entriesState.loading && !entriesState.error && (
						<tr>
							<td className="cwp-entries-prompt" colSpan={5}>
								<div className="content">
									<span>{__('Loading Entries', TEXT_DOMAIN)}</span>
									<Spinner />
								</div>
							</td>
						</tr>
					)}
					{!entriesState.loading && entriesState.error && (
						<tr>
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
						</tr>
					)}
					{!entriesState.loading && !entriesState.error && isEmpty(data) && (
						<tr>
							<td className="cwp-entries-prompt" colSpan={5}>
								<div className="content">
									<span>{__('No Entries Found!', TEXT_DOMAIN)}</span>
								</div>
							</td>
						</tr>
					)}

				{!entriesState.loading &&
					!entriesState.error &&
					!isEmpty(data) && (
						<>
							{map(data, (entriesData, index) => {
								const extra = get(entriesData, 'entry_extra');
								const label = get(extra, 'form_label');
								const status = get(entriesData, 'entry_status');
								const date = get(entriesData, 'date');
								const form_url = get(extra, 'url');
								const entry_id = get(entriesData, 'id');
								const form_id = get(extra, 'form_id');
								const site_url = get(extra, 'site_url');
								const post_id = get(extra, 'post_id');
								const edit_url =
									site_url +
									`/wp-admin/post.php?post=${post_id}&action=edit`;
								const single_form_url = '#/entries/'.concat(
									form_id
								);

								return (
									<tr key={entry_id}>
										<td className="plugin-title column-primary">
											<strong className="field-title">
												Form:{' '}
											</strong>
											<strong>{label}</strong>

											<div className="row-actions ">
												<span className={0}>
													<ExternalLink
														href={form_url}
													>
														{__(
															'Preview Form',
															TEXT_DOMAIN
														)}
													</ExternalLink>{' '}
													|{' '}
													<ExternalLink
														href={edit_url}
													>
														{__(
															'Edit Form',
															TEXT_DOMAIN
														)}
													</ExternalLink>{' '}
												</span>
											</div>
										</td>
										<td className="column-description status">
											<strong className="field-title">
												Status:{' '}
											</strong>
											{isEmpty(status) ? (
												<p>{__('-', TEXT_DOMAIN)}</p>
											) : (
												<Button
													isLink
													onClick={() =>
														props.getEntries(1, {
															entry_status:
																status,
														})
													}
												>
													{capitalize(status)}
												</Button>
											)}
										</td>
										<td className="column-status date">
											<strong className="field-title">
												Date:{' '}
											</strong>
											<p>{timeSince(new Date(date))}</p>
										</td>
										<td className="column-actions actions">
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
											<NavLink
												to={{
													...defaultLocation,
													hash: single_form_url,
												}}
											>
												<IconButton
													icon="list-view"
													label={__(
														'List All Form Entries',
														TEXT_DOMAIN
													)}
												/>
											</NavLink>
										</td>
									</tr>
								);
							})}
						</>
					)}
				</tbody>
				<tfoot>
					<tr>
						<th
							scope="col"
							className="manage-column column-form form column-primary"
						>
							{__('Form', TEXT_DOMAIN)}
						</th>
						<th
							scope="col"
							className="manage-column status column-primary"
						>
							{__('Status', TEXT_DOMAIN)}
						</th>
						<th
							scope="col"
							className="manage-column date column-primary"
						>
							{__('Date', TEXT_DOMAIN)}
						</th>
						<th
							scope="col"
							className="manage-column actions column-primary"
						>
							{__('Actions', TEXT_DOMAIN)}
						</th>
					</tr>
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
)(withRouter(EntriesTable));
