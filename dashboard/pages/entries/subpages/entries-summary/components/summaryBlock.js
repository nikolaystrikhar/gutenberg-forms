import React, { useState, Fragment, useEffect } from 'react';
import {
	Card,
	CardBody,
	CardHeader,
	CardMedia,
	Icon,
	CardFooter,
	TextControl,
	IconButton,
} from '@wordpress/components';
import { TEXT_DOMAIN } from '../../../../../contants';
import SkeletonRow from '../../../../../components/skeleton-row';
import { map, get } from 'lodash';
import { withRouter, NavLink } from 'react-router-dom';
import { linkify } from '../../../utils';
import { isEmpty, toString } from 'lodash';
import unitize from 'unitize';
import Chart from './chart/checkbox.radio.chart';
import SummaryPagination from './pagination';

const { Button } = wp.components;

const $ = window.jQuery;
const { __ } = wp.i18n;

function SummaryBlock(props) {
	const [summary, setSummary] = useState(true);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [data, setData] = useState({});
	const [currentPage, setCurrentPage] = useState(1);

	const { hash, pathname, search } = props.location;

	const defaultLocation = { hash, pathname };

	const response = get(data, 'response');
	const rest_url = get(window, 'cwp_global.rest_url');
	const summary_proxy = rest_url.concat(
		'gutenberg-forms/entries/v1/summary/field'
	);

	const totalEntries = toString(get(data, 'total_entries'));
	const totalFieldEntries = toString(get(data, 'total_field_responses'));
	const visual_info = get(data, 'visual_info');
	const field = get(props, 'field');
	const field_type = get(props, `field_types.${field}`);
	const per_page = 5;

	const totalPages = Math.ceil(~~totalFieldEntries / per_page);

	const toggleSummary = () => {
		setSummary(!summary);
	};

	const iconStyling = summary
		? {
				transform: 'rotate(180deg)',
		  }
		: {
				transform: 'rotate(0deg)',
		  };

	const fetchFieldSummary = (page = currentPage) => {
		const { field, formId } = props;

		const requestBody = {
			field_id: field,
			form_id: formId,
			page,
			per_page: per_page,
			field_type,
		};

		setLoading(true);
		setError(false);

		$.ajax({
			url: summary_proxy,
			data: requestBody,
		})
			.done((d) => {
				setData(d);
				setLoading(false);
			})
			.fail(() => {
				console.error(error);
				setError(true);
				setLoading(false);
			});
	};

	const handlePagination = (dir) => {
		const nextIndex = currentPage + 1,
			prevIndex = currentPage - 1,
			hasNextPage = nextIndex <= totalPages,
			hasPrevPage = prevIndex > 0;

		if (dir === 'next' && hasNextPage) {
			setCurrentPage(nextIndex);
			fetchFieldSummary(nextIndex);
		}

		if (dir === 'prev' && hasPrevPage) {
			setCurrentPage(prevIndex);
			fetchFieldSummary(prevIndex);
		}
	};

	useEffect(fetchFieldSummary, []);
	useEffect(fetchFieldSummary, [currentPage]);

	return (
		<Card className="cwp-summary-block">
			<CardHeader className="cwp-head" onClick={toggleSummary}>
				<div className="name">
					<Icon
						style={iconStyling}
						className="toggle-icon"
						icon="arrow-down-alt2"
					/>
					<div>
						<h3 className="toggle-icon">{props.field}</h3>
						{!isEmpty(totalEntries) &&
							!isEmpty(totalFieldEntries) && (
								<p className="answered">
									{__(
										`${unitize(
											totalFieldEntries
										).toString()} out of ${unitize(
											totalEntries
										).toString()} respondents answered`,
										TEXT_DOMAIN
									)}
								</p>
							)}
					</div>
				</div>
			</CardHeader>
			{summary && (
				<CardBody className="cwp-body">
					{loading && !error && (
						<Fragment>
							<SkeletonRow />
							<SkeletonRow />
							<SkeletonRow />
							<SkeletonRow />
							<SkeletonRow />
						</Fragment>
					)}
					{!loading && !error && isEmpty(visual_info) && (
						<Fragment>
							{map(response, (res, idx) => {
								const value = get(res, 'value');
								const slug = get(res, 'post_slug');

								return (
									!isEmpty(value) && (
										<div
											key={idx}
											className="cwp-field-value"
										>
											<div>
												<p
													dangerouslySetInnerHTML={{
														__html: linkify(
															value,
															true
														),
													}}
												></p>
											</div>
											<div className="action">
												<NavLink
													to={{
														...defaultLocation,
														hash: '#/entries/post_slug='.concat(
															slug
														),
													}}
												>
													<IconButton
														icon="visibility"
														label={__(
															'View Full Entry',
															TEXT_DOMAIN
														)}
													/>
												</NavLink>
											</div>
										</div>
									)
								);
							})}
							<SummaryPagination
								onNext={() => handlePagination('next')}
								onPrev={() => handlePagination('prev')}
								currentPage={currentPage}
								totalPages={totalPages}
							/>
						</Fragment>
					)}

					{!loading && !error && !isEmpty(visual_info) && (
						<Chart data={data} type={field_type} />
					)}

					{!loading && error && (
						<div className="cwp-prompt">
							<span>{__('Failed To Fetch', TEXT_DOMAIN)}</span>
							<Button isLink onClick={fetchFieldSummary}>
								{__('Try Again', TEXT_DOMAIN)}
							</Button>
						</div>
					)}
				</CardBody>
			)}
		</Card>
	);
}

export default withRouter(SummaryBlock);
