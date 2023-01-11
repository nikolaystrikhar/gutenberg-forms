import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { get, map, isEmpty } from 'lodash';
import Plugin from './plugin';
import { TEXT_DOMAIN } from '../../../../../contants';

const { Spinner, Button, Icon } = wp.components;
const { __ } = wp.i18n;

/**
 * Will render a plugin list that forms are available for importing
 */

function PluginList(props) {
	const [plugins, setPlugins] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	const restUrl = get(window, 'cwp_global.rest_url');
	const proxy = restUrl + 'gutenberg-forms/forms/v1/imports/plugins';

	const fetchPlugins = () => {
		setLoading(true);
		setError(false);

		axios
			.get(proxy)
			.then((response) => {
				setLoading(false);
				setError(false);
				setPlugins(response.data);
			})
			.catch((error) => {
				setLoading(false);
				setError(true);
			});
	};

	useEffect(fetchPlugins, []);

	return (
		<div className="cwp_import_plugin_list">
			{!loading && !error && (
				<h3 className="gufo-mb-5 gufo-text-lg gufo-font-normal gufo-leading-6 gufo-text-gray-900">
					{__('Import forms from other plugins', 'forms-gutenberg')}
				</h3>
			)}
			{!loading &&
				!error &&
				map(plugins, (plugin, idx) => (
					<Plugin
						onSelect={(pl) => props.onSelect(pl)}
						plugin={plugin}
						key={idx}
					/>
				))}
			{loading && !error && (
				<div className="cwp_import_plugin_list_prompt">
					<span>
						<Spinner />
						{__('Fetching Available Imports', TEXT_DOMAIN)}
					</span>
				</div>
			)}
			{!loading && error && (
				<div className="cwp_import_plugin_list_prompt">
					<span>
						{__('Failed to Fetch Available Imports', TEXT_DOMAIN)}{' '}
						<Button
							onClick={fetchPlugins}
							style={{ marginLeft: 10 }}
							isLink
						>
							{__('Try Again', TEXT_DOMAIN)}
						</Button>
					</span>
				</div>
			)}
			{!loading && !error && isEmpty(plugins) && (
				<div className="cwp_empty">
					<Icon icon="info-outline" />
					<span>
						{__(
							'No Supported Form Plugin found to import!',
							TEXT_DOMAIN
						)}
					</span>
				</div>
			)}
		</div>
	);
}

export default PluginList;
