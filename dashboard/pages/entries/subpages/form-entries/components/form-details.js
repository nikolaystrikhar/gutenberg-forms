import React, { Fragment } from 'react';
import { Card, CardBody, Spinner, ExternalLink } from '@wordpress/components';
import { connect } from 'react-redux';
import { extract_form_details } from '../../../utils';
import { TEXT_DOMAIN } from '../../../../../contants';
import { isEmpty, get } from 'lodash';
import unitize from 'unitize';

const { __ } = wp.i18n;

function FormDetails(props) {
	const {
		entries,
		entries: { data, totalEntries },
	} = props;

	const site_url = extract_form_details(data, 'site_url');
	const post_id = extract_form_details(data, 'post_id');
	const edit_url =
		site_url + `/wp-admin/post.php?post=${post_id}&action=edit`;

	return (
		<div className="cwp-form-details">
			{(!isEmpty(data) || entries.loading) && (
				<Card className="cwp-form-details-root">
					<CardBody>
						{!entries.error && !isEmpty(entries.data) && (
							<div className="cwp-form-detail-head">
								<div className="content">
									<h1 className="detail-head">
										{extract_form_details(
											data,
											'form_label'
										)}
										<span>
											{extract_form_details(
												data,
												'form_id'
											)}
										</span>
									</h1>
									<div className="actions">
										<ExternalLink
											href={extract_form_details(
												data,
												'url'
											)}
										>
											{__('Preview Form', TEXT_DOMAIN)}
										</ExternalLink>
										<ExternalLink href={edit_url}>
											{__('Edit Form', TEXT_DOMAIN)}
										</ExternalLink>
									</div>
								</div>
								<div>
									{totalEntries !== 0 ? (
										<h1 className="total-entries">
											{unitize(totalEntries).toString()}{' '}
											{__('Total Entries', TEXT_DOMAIN)}
										</h1>
									) : (
										<h1 className="total-entries">
											{__('No Entries', TEXT_DOMAIN)}
										</h1>
									)}
								</div>
							</div>
						)}
						{entries.loading &&
							!entries.error &&
							isEmpty(entries.data) && (
								<div className="cwp-loader">
									<span>{__('Fetching form details')}</span>
									<Spinner />
								</div>
							)}
						{!entries.loading && entries.error && (
							<div className="cwp-loader">
								<p>
									{__('Something Went Wrong!', TEXT_DOMAIN)}
								</p>
							</div>
						)}
					</CardBody>
				</Card>
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

export default connect(mapStateToProps, null)(FormDetails);
