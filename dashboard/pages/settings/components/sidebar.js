import React from 'react';
import { connect } from 'react-redux';
import {
	Panel,
	PanelBody,
	MenuGroup,
	MenuItem,
	SelectControl,
} from '@wordpress/components';
import { map, isEqual, isEmpty, get, each } from 'lodash';
import unitize from 'unitize';

function Sidebar(props) {
	const { integrations } = props.settings;
	const isResponsive = get(props, 'isResponsive');

	const { hash, pathname, search } = props.location;

	const getActive = (name) => {
		const currentHash = '#/settings/' + name;
		const searchHash = hash === '#/settings' ? '#/settings/general' : hash;

		if (isEqual(searchHash, currentHash)) {
			return {
				isPrimary: true,
			};
		}

		return {};
	};

	const getActiveSettingsPage = () => {
		let activePage = '';

		each(integrations, (integrations, name) => {
			const buildHash = '#/settings/' + name;

			if (isEqual(buildHash, hash)) {
				activePage = name;
			}
		});

		return activePage;
	};

	const onSelect = (tab) => {
		props.history.push({
			pathname,
			search,
			hash: '#/settings/' + tab,
		});
	};
	const selectOptions = [
		{
			label: 'General',
			value: 'general',
		},
		{
			label: 'Import',
			value: 'import',
		},
		...map(integrations, (integration, name) => {
			return {
				label: integration.title,
				value: name,
			};
		}),
	];

	return (
		<div
			className={`cwp_sidebar ${
				isResponsive ? 'cwp-responsive-sidebar' : 'cwp-full-sidebar'
			}`}
		>
			{!isResponsive ? (
				<MenuGroup>
					<MenuItem
						onClick={() => onSelect('general')}
						{...getActive('general')}
					>
						General
					</MenuItem>
					<MenuItem
						onClick={() => onSelect('import')}
						{...getActive('import')}
					>
						Import
					</MenuItem>
					{map(integrations, (integration, name) => {
						const hasFields = !isEmpty(get(integration, 'fields'));

						return (
							integration.enable &&
							hasFields && (
								<MenuItem
									onClick={() => onSelect(name)}
									{...getActive(name)}
								>
									{integration.title}
								</MenuItem>
							)
						);
					})}
				</MenuGroup>
			) : (
				<SelectControl
					value={getActiveSettingsPage()}
					onChange={(page) => onSelect(page)}
					options={selectOptions}
				/>
			)}
		</div>
	);
}

const mapStateToProps = (state) => {
	const { settings } = state;

	return {
		settings,
	};
};

export default connect(mapStateToProps, null)(Sidebar);
