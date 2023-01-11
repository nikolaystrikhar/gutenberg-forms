import React, { useEffect, useState } from 'react';
import { TabPanel, Button } from '@wordpress/components';
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
				title: __('Dashboard', 'forms-gutenberg'),
			},
			{
				name: '#/integrations',
				title: __('Extensions', 'forms-gutenberg'),
			},
			{
				name: '#/settings',
				title: __('Settings', 'forms-gutenberg'),
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
		<nav className="gufo-flex gufo-space-x-4">
			{tabs.map((tab, index) => {
				const isActive = isEqual(tab.name, currentTab);
				const activeClassName = isActive ? 'gufo-text-white hover:gufo-text-white' : 'gufo-text-cyan-100 hover:gufo-text-cyan-100';
				const className = 'gufo-text-sm gufo-rounded-md gufo-bg-white gufo-bg-opacity-0 gufo-px-3 gufo-py-2 hover:gufo-bg-opacity-10 '.concat(activeClassName);

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
		</nav>
	);
}

export default withRouter(Navigation);
