import React, { useEffect, useState } from 'react';
import { TabPanel, Button } from '@wordpress/components';
import { TEXT_DOMAIN } from '../contants';
import { isEmpty, isEqual, get } from 'lodash';
import { withRouter } from 'react-router-dom';

const { __ } = wp.i18n;

function Navigation(props) {
	const [currentTab, setCurrentTab] = useState(''); // current tab name here...

	const { hash, pathname, search } = props.location;
	const customTabs = get(props, 'tabs');

	const tabs = isEmpty(customTabs)
		? [
				{
					name: '#/dashboard',
					title: __('Dashboard', TEXT_DOMAIN),
				},
				{
					name: '#/integrations',
					title: __('Integrations', TEXT_DOMAIN),
				},
				{
					name: '#/settings',
					title: __('Settings', TEXT_DOMAIN),
				},
		  ]
		: customTabs;

	const getInitialTab = () => {
		let initialTab = isEmpty(hash) ? '#/dashboard' : hash;

		tabs.forEach((tab) => {
			if (initialTab.startsWith(tab.name)) {
				initialTab = tab.name;
			}
		});

		return initialTab;
	};

	useEffect(() => {
		setCurrentTab(getInitialTab());
	}, []);

	useEffect(() => {
		setCurrentTab(getInitialTab()); // subscribing to whenever page hash changes to update the active button
	}, [hash]);

	const onSelect = (tab) => {
		if (isEqual(tab.name, currentTab)) return; // if the page is already active

		setCurrentTab(tab.name);

		props.history.push({
			pathname,
			search,
			hash: tab.name,
		});
	};

	return (
		<div className="cwp_navigation">
			{tabs.map((tab, index) => {
				const isActive = isEqual(tab.name, currentTab);
				const activeClassName = isActive ? 'is-active' : '';
				const className = 'cwp-tab-btn '.concat(activeClassName);

				return (
					<Button
						key={index}
						className={className}
						onClick={() => onSelect(tab)}
					>
						{tab.title}
					</Button>
				);
			})}
		</div>
	);
}

export default withRouter(Navigation);
