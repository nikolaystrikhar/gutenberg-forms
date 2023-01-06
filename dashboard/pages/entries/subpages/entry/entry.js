import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { parse_entry_id, parse_entry_slug } from '../../utils';
import { get, isEqual, filter, isEmpty } from 'lodash';
import axios from 'axios';
import Content from './components/Content';
import Sidebar from './components/Sidebar';
import { Spinner } from '@wordpress/components';
import { TEXT_DOMAIN } from '../../../../contants';
import { updateEntry } from '../../../../redux/actions/entries/updateEntry';
import { useStateCallback } from '../../../../hooks/useStateCallback';

const { __ } = wp.i18n;
const { Button } = wp.components;
const $ = window.jQuery;

/**
 * Extended components
 */

const GlobalComponents = get(window, 'cwp_gf');

function Entry(props) {
	const [data, setData] = useStateCallback({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [updatingStatus, setUpdatingStatus] = useState(false);
	const [deletingStatus, setDeletingStatus] = useState(false);

	const { hash } = props.location;
	const required_entry_id = parse_entry_id(hash);
	const required_entry_slug = parse_entry_slug(hash);
	const ajax_url = get(window, 'cwp_global.ajax_url');

	const updateStatus = (status, updatedData = data) => {
		let entry_post_id = get(updatedData, 'id');

		const updatedEntry = {
			...updatedData,
			entry_status: status,
		};

		setUpdatingStatus(true);

		$.ajax({
			type: 'POST',
			url: ajax_url,
			data: {
				status,
				action: 'cwp_gf_update_entry_status',
				id: entry_post_id,
			},
			success: (response) => {
				setUpdatingStatus(false);
				setData(updatedEntry);
				props.updateEntry(updatedEntry);
			},
			error: (err) => {
				console.log(err);
				setUpdatingStatus(false);
			},
		});
	};

	const deleteEntry = () => {
		const id = get(data, 'id');

		setDeletingStatus(true);

		$.ajax({
			type: 'POST',
			url: ajax_url,
			data: {
				action: 'cwp_gf_delete_entry',
				id,
			},
			success: (response) => {
				setDeletingStatus(false);
				props.history.goBack();
			},
			error: (err) => {
				setDeletingStatus(false);
			},
		});
	};

	const fetchEntry = () => {
		const savedEntries = props.entries.data;
		const [savedEntry = {}] = filter(savedEntries, (entry) => {
			let id = get(entry, 'id');

			return isEqual(id, required_entry_id);
		});

		const rest_url = get(window, 'cwp_global.rest_url');

		if (isEmpty(savedEntry)) {
			setLoading(true);
			setError(false);

			let single_entry_proxy = null;

			if (required_entry_id !== null) {
				single_entry_proxy = rest_url
					.concat('wp/v2/cwp_gf_entries/')
					.concat(required_entry_id);
			} else if (!isEmpty(required_entry_slug)) {
				single_entry_proxy = rest_url
					.concat('wp/v2/cwp_gf_entries/')
					.concat('?post_slug=')
					.concat(required_entry_slug);
			}

			if (!isEmpty(single_entry_proxy)) {
				axios
					.get(single_entry_proxy)
					.then((response) => {
						setLoading(false);
						setData(() => {
							return isEmpty(required_entry_slug)
								? response.data
								: get(response, 'data[0]');
						}, markEntryAsRead);
					})
					.catch((error) => {
						setError(true);
						setLoading(false);
					});
			}
		} else {
			setData(() => savedEntry, markEntryAsRead);
		}
	};

	useEffect(fetchEntry, []);

	// marking as read when the entry loads
	const markEntryAsRead = (data) => {
		const status = get(data, 'entry_status');

		if (isEqual(status, 'unread')) {
			updateStatus('read', data);
		}
	};

	return (
		<div className="cwp-entry">
			{!loading && !error && (
				<Fragment>
					<div className="cwp-entry-root">
						<Content
							data={data}
							updateStatus={updateStatus}
							statusLoading={updatingStatus}
							deleteEntry={deleteEntry}
							deletingStatus={deletingStatus}
						/>
					</div>
				</Fragment>
			)}
			{loading && !error && (
				<div className="cwp-loader">
					<span>{__('Fetching Entry Details', TEXT_DOMAIN)}</span>{' '}
					<Spinner />
				</div>
			)}
			{!loading && error && (
				<div className="cwp-loader">
					<span>
						{__('Failed to load Entry', TEXT_DOMAIN)}{' '}
						<Button isLink onClick={fetchEntry}>
							{__('Try Again', TEXT_DOMAIN)}
						</Button>
					</span>
				</div>
			)}
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
	updateEntry,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Entry));
