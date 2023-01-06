import React, { Fragment, useState } from 'react';
import { Card, CardBody, Modal, ExternalLink } from '@wordpress/components';
import { TEXT_DOMAIN } from '../../../../../contants';
import { get, capitalize, isEqual, isEmpty, findIndex } from 'lodash';
import Table from './table';
import { connect } from 'react-redux';
import { setRefetchingStatus as setRefetchingStatusAction } from '../../../../../redux/actions/entries/setRefetchingStatus';
import { withRouter } from 'react-router-dom';

const { Button, Icon } = wp.components;
const { __ } = wp.i18n;

/**
 * Extended components
 */

const GlobalComponents = get(window, 'cwp_gf');

function Content({
	data,
	updateStatus,
	statusLoading,
	deleteEntry,
	deletingStatus,
	entries,
	setRefetchingStatus,
	history,
	location: { hash, pathname, search },
}) {
	const [detailsTab, setDetailsTab] = useState('fields');
	const [deleteConfirmationModal, setDeleteConfirmationModal] =
		useState(false);

	const extra_meta = get(data, 'entry_extra');
	const form_label = get(extra_meta, 'form_label');
	const date = get(extra_meta, 'date');
	const day = get(extra_meta, 'day');
	const status = get(data, 'entry_status');
	const entry_fields = get(data, 'entry_fields');
	const entry_id = get(data, 'id');
	const entry_template = get(data, 'entry_template');
	const site_url = get(extra_meta, 'site_url');
	const url = get(extra_meta, 'url');
	const post_id = get(extra_meta, 'post_id');
	const edit_url =
		site_url + `/wp-admin/post.php?post=${post_id}&action=edit`;

	const toggleStatus = () => {
		const newStatus = isEqual(status, 'read') ? 'unread' : 'read';

		updateStatus(newStatus);
	};

	const getStatusButtonBusy = () => {
		return statusLoading
			? {
					isBusy: true,
					isDisabled: true,
			  }
			: {};
	};

	const getDeletingStatus = () => {
		return deletingStatus
			? {
					isDisabled: true,
					isBusy: true,
			  }
			: {};
	};

	const backToList = () => {
		const lastEntriesTableHash = get(entries, 'entriesFetchedHash');

		//? will not refetch the list when navigated
		setRefetchingStatus(false);

		// navigation back
		history.push({
			pathname,
			search,
			hash: lastEntriesTableHash,
		});
	};

	const getCurrentEntryIndex = () => {
		const currentEntryIndex = findIndex(entries.data, (entry) =>
			isEqual(get(entry, 'id'), entry_id)
		);
		return currentEntryIndex;
	};

	const navigateToEntry = (pos) => {
		const currentEntryIndex = getCurrentEntryIndex();
		const nextEntryIndex = currentEntryIndex + 1;
		const prevEntryIndex = currentEntryIndex - 1;
		const nextEntry = get(entries.data, nextEntryIndex);
		const prevEntry = get(entries.data, prevEntryIndex);

		if (
			hasEntry('next') &&
			!isEqual(currentEntryIndex, -1) &&
			pos === 'next'
		) {
			const nextEntryHash = '#/entries/' + get(nextEntry, 'id');

			history.push({
				pathname,
				search,
				hash: nextEntryHash,
			});
		} else if (
			hasEntry('prev') &&
			!isEqual(currentEntryIndex, -1) &&
			pos === 'prev'
		) {
			const prevEntryHash = '#/entries/' + get(prevEntry, 'id');

			history.push({
				pathname,
				search,
				hash: prevEntryHash,
			});
		}
	};

	const hasEntry = (pos) => {
		const currentEntryIndex = getCurrentEntryIndex();
		const nextEntryIndex = currentEntryIndex + 1;
		const prevEntryIndex = currentEntryIndex - 1;

		if (pos === 'next') {
			return isEmpty(get(entries.data, nextEntryIndex)) ? false : true;
		} else if (pos === 'prev') {
			return isEmpty(get(entries.data, prevEntryIndex)) ? false : true;
		}
	};

	return (
		<div className="content">
			{!isEmpty(entries.data) && (
				<div className="back-to-list">
					<Button size="small" onClick={backToList}>
						<Icon icon="arrow-left-alt2" />{' '}
						{__('Go Back', TEXT_DOMAIN)}
					</Button>
					<div>
						{hasEntry('prev') && (
							<Button onClick={() => navigateToEntry('prev')}>
								<Icon icon="arrow-left-alt2" />
								{__('Previous', TEXT_DOMAIN)}
							</Button>
						)}
						{hasEntry('next') && (
							<Button onClick={() => navigateToEntry('next')}>
								{__('Next', TEXT_DOMAIN)}

								<Icon icon="arrow-right-alt2" />
							</Button>
						)}
					</div>
				</div>
			)}
			<Card size="small" className="content-head-info">
				<CardBody size="large">
					<div className="status-main">
						{!isEmpty(status) && (
							<span className={`status ${status}`}>
								Status: {capitalize(status)}
							</span>
						)}
					</div>
					<h1>{form_label}</h1>
					<span className="date">
						<Icon icon="calendar" className="calendar" />
						{date}
						{' - '}
						{day}
					</span>
					<div className="links">
						<ExternalLink href={url}>Preview Form</ExternalLink>
						<ExternalLink href={edit_url}>Edit Form</ExternalLink>
						<GlobalComponents.extend.entries.entry.details.footer.links.Slot
							bubblesVirtually
						/>
					</div>
					<div className="foot">
						<Button
							onClick={() => setDeleteConfirmationModal(true)}
							className="danger"
						>
							{__('Delete Entry', TEXT_DOMAIN)}
						</Button>
						<div className="more-actions">
							<Button
								isDefault
								{...getStatusButtonBusy()}
								onClick={toggleStatus}
							>
								{isEqual(status, 'read')
									? 'Mark As Unread'
									: 'Mark As Read'}
							</Button>
							<GlobalComponents.extend.entries.entry.details.footer.actions.Slot
								fillProps={data}
								bubblesVirtually
							/>
						</div>
					</div>
				</CardBody>
			</Card>

			<div className="cwp-field-details" style={{ marginTop: 20 }}>
				<button
					onClick={() => setDetailsTab('fields')}
					className={`cwp-tab-btn ${
						detailsTab === 'fields' ? 'active' : ''
					}`}
				>
					{__('Fields', TEXT_DOMAIN)}
				</button>
				<button
					className={`cwp-tab-btn ${
						detailsTab === 'template' ? 'active' : ''
					}`}
					onClick={() => setDetailsTab('template')}
				>
					{__('Email Template', TEXT_DOMAIN)}
				</button>
				<button
					className={`cwp-tab-btn ${
						detailsTab === 'extra' ? 'active' : ''
					}`}
					onClick={() => setDetailsTab('extra')}
				>
					{__('Additional Information', TEXT_DOMAIN)}
				</button>
				{detailsTab === 'fields' && (
					<Card size="small" className="cwp-field-details-card">
						<CardBody>
							{!isEmpty(entry_fields) && (
								<Table data={entry_fields} />
							)}
						</CardBody>
					</Card>
				)}
				{detailsTab === 'template' && (
					<Card size="small" className="cwp-field-details-card">
						<CardBody>
							{!isEmpty(entry_template) && (
								<Table
									data={entry_template}
									preCells={['body']}
								/>
							)}
						</CardBody>
					</Card>
				)}
				{detailsTab === 'extra' && (
					<Card size="small" className="cwp-field-details-card">
						<CardBody>
							{!isEmpty(extra_meta) && (
								<Table data={extra_meta} />
							)}
						</CardBody>
					</Card>
				)}
			</div>

			{deleteConfirmationModal && (
				<Modal
					className="cwp-gf-modal"
					title={__('Delete Entry?', TEXT_DOMAIN)}
					isDismissible={false}
					onRequestClose={() => setDeleteConfirmationModal(false)}
				>
					<div className="content">
						<p>
							{__(
								'This will delete the entry permanently',
								TEXT_DOMAIN
							)}
						</p>
					</div>
					<div className="footer">
						<Button
							isDefault
							onClick={() => setDeleteConfirmationModal(false)}
						>
							Cancel
						</Button>
						<Button
							{...getDeletingStatus()}
							isPrimary
							onClick={deleteEntry}
						>
							{deletingStatus ? 'Deleting...' : 'Delete'}
						</Button>
					</div>
				</Modal>
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
	setRefetchingStatus: setRefetchingStatusAction,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(Content));
