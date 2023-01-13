import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { proxy, airtable_key } from '../../../contants';
import { get, isEmpty, map } from 'lodash';
import Loading from './loading';
import FetchError from './error';
import AvailableIntegration from './availableIntegration';
const { __ } = wp.i18n;

function InstallIntegrations() {
	const [availableIntegrations, setAvailableIntegrations] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	const fetchRecords = () => {
		setLoading(true);
		setError(false);

		// TODO: Remove addons fetching. They should be static.
		axios
			.get(proxy, {
				headers: {
					Authorization: `Bearer ${airtable_key}`,
				},
			})
			.then((response) => {
				const records = get(response, 'data.records');
				const fetched_records = isEmpty(records) ? [] : records; // null exception
				const global_integrations = get(
					window,
					'cwp_global.settings.integrations'
				);

				const filtered_records = fetched_records.filter((record) => {
					const plugin_id = get(record, 'fields.plugin_id');

					if (plugin_id in global_integrations) {
						return false;
					}

					return true;
				}); // filtering the integrations that are already installed

				setAvailableIntegrations(filtered_records);
				setLoading(false);
				setError(false);
			})
			.catch((err) => {
				console.error(err);
				setLoading(false);
				setError(true);
			});
	};

	useEffect(() => {
		fetchRecords();
	}, []);

	return (
		<div className="gufo-mt-10 cwp_install_integrations_root">
			{!loading && !error && !isEmpty(availableIntegrations) && (
				<h3 className="gufo-mb-5 gufo-text-lg gufo-font-normal gufo-leading-6 gufo-text-gray-900">
					{__('Available', 'forms-gutenberg')}
				</h3>
			)}
			{loading && !error ? (
				<Loading />
			) : (
				<div className="cwp_install_integ_grid">
					{map(availableIntegrations, (integration, index) => {
						return (
							<AvailableIntegration
								key={index}
								integration={integration}
							/>
						);
					})}
				</div>
			)}
			{!loading && error && <FetchError onRetry={fetchRecords} />}
		</div>
	);
}

export default InstallIntegrations;
