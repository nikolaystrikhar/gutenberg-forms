import React, { useState } from 'react';
import { TEXT_DOMAIN } from '../../../../../contants';
import {
	get,
	debounce,
	map,
	includes,
	filter,
	clone,
	isEmpty,
	isNumber,
} from 'lodash';
import { TextControl, FormTokenField } from '@wordpress/components';
import axios from 'axios';

const { __ } = wp.i18n;
const { Button, Spinner } = wp.components;

function PluginImport(props) {
	const { plugin } = props;

	const title = get(plugin, 'Title');
	const description = get(plugin, 'description');
	const TextDomain = get(plugin, 'TextDomain');
	const rest_url = get(window, 'cwp_global.rest_url');

	const [selectedForms, setSelectedForms] = useState([]);
	const [search, setSearch] = useState('');
	const [loading, setLoading] = useState(false);
	const [suggestions, setSuggestions] = useState([]);
	const [searchQuery, setSearchQuery] = useState({});
	const [importing, setImporting] = useState(false);

	const getSuggestions = async (searchQuery = search) => {
		setLoading(true);
		const proxy =
			rest_url +
			`gutenberg-forms/forms/v1/imports/plugins/options?plugin=${TextDomain}&search=${searchQuery}`;

		try {
			const response = await axios.get(proxy);
			setLoading(false);
			setSuggestions(response.data);
		} catch (error) {
			setLoading(false);
		}
	};

	const handleSearch = (nextSearch) => {
		const search = debounce(() => getSuggestions(nextSearch), 500);
		setSearchQuery((prevSearch) => {
			if (prevSearch.cancel) {
				prevSearch.cancel();
			}
			return search;
		});
		setSearch(nextSearch);
		search(nextSearch);
	};

	const handleNewForm = (forms) => {
		const formToSelect = get(forms, forms.length - 1);

		if (isEmpty(forms)) {
			setSelectedForms(forms);
			return;
		} else {
			const filtered_form = filter(suggestions, { title: formToSelect });
			const id = get(filtered_form, '[0].id');

			if (!isNumber(id)) {
				const newSelectedForms = clone(selectedForms);
				newSelectedForms.pop();
				setSelectedForms(newSelectedForms);
				return;
			}

			const newSelectedForms = clone(selectedForms);

			newSelectedForms.push({
				value: formToSelect,
				title: id,
			});

			setSelectedForms(newSelectedForms);
		}
	};

	const label = (
		<div className="cwp-sf-label">
			<span>
				Search Form
				{loading && <Spinner />}
			</span>
		</div>
	);

	const importSelectedForms = async () => {
		const proxy = rest_url + 'gutenberg-forms/forms/v1/import/plugin';
		setImporting(true);
		const post_ids = map(selectedForms, 'title');

		try {
			const response = await axios.post(proxy, {
				post_ids,
				plugin: TextDomain,
				type: 'selective',
			});
			const { data } = response;
			console.log(data);
			setImporting(false);
		} catch (error) {
			console.error(error);
			setImporting(true);
		}
	};

	return (
		<div className="cwp_plugin_import_options">
			<div className="cwp_plugin_import_header">
				<Button icon="arrow-left-alt2" onClick={props.onExit}>
					{__('Go Back', TEXT_DOMAIN)}
				</Button>
			</div>
			<div className="cwp_plugin_import_settings">
				<h3>{title}</h3>
				<p>{__(description, 'TEXT_DOMAIN')}</p>
				<div className="cwp_plugin_import_settings_search">
					<div>
						<FormTokenField
							className="cwp_search_f"
							label={__(label, TEXT_DOMAIN)}
							placeholder={__('Search Form', TEXT_DOMAIN)}
							value={selectedForms}
							suggestions={map(suggestions, 'title')}
							onChange={handleNewForm}
							onInputChange={handleSearch}
						/>
					</div>
					<div className="cwp_plugin_import_settings_footer">
						<Button isDefault>
							{__('Import All', TEXT_DOMAIN)}
						</Button>
						<Button
							isDefault
							isBusy={importing}
							onClick={importSelectedForms}
						>
							{__('Import Selected', TEXT_DOMAIN)}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PluginImport;
