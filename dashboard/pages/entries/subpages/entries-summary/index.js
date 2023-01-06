import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { extractFormId } from '../../utils';
import axios from 'axios';
import { get, map } from 'lodash';
import SummaryBlock from './components/summaryBlock';
import { Spinner } from '@wordpress/components';
import { TEXT_DOMAIN } from '../../../../contants';

const $ = window.jQuery;
const { Button } = wp.components;
const { __ } = wp.i18n;

function EntriesSummary(props) {
	const [data, setData] = useState({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	const { hash } = props.location;
	const rest_url = get(window, 'cwp_global.rest_url');
	const fields_proxy = rest_url.concat('gutenberg-forms/entries/v1/fields');

	const formId = extractFormId(hash);
	const fields = get(data, 'fields');
	const field_types = get(data, 'types');

	const fetchFields = () => {
		setLoading(true);
		setError(false);

		$.ajax({
			url: fields_proxy,
			data: { form_id: formId },
		})
			.done((d) => {
				setData(d);
				setLoading(false);
			})
			.fail(() => {
				console.error(error);
				setLoading(false);
				setError(true);
			});
	};

	useEffect(fetchFields, []);

	return (
		<div className="cwp-entries-summary-root">
			{map(fields, (field, idx) => (
				<SummaryBlock
					field={field}
					key={idx}
					formId={formId}
					field_types={field_types}
				/>
			))}

			{loading && !error && (
				<div className="cwp-loader">
					<span>{__('Fetching Fields', TEXT_DOMAIN)}</span>{' '}
					<Spinner />
				</div>
			)}
			{!loading && error && (
				<div className="cwp-loader">
					<span>{__('Failed To Fetch Fields', TEXT_DOMAIN)}</span>{' '}
					<Button isLink onClick={fetchFields}>
						{__('Try Again')}
					</Button>
				</div>
			)}
		</div>
	);
}

export default withRouter(EntriesSummary);
