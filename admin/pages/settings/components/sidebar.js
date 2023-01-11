import React from 'react';
import { connect } from 'react-redux';
import { MenuGroup, MenuItem } from '@wordpress/components';
import { map, isEqual, isEmpty, get, each } from 'lodash';

function Sidebar(props) {
	const { integrations } = props.settings;
	const { hash, pathname, search } = props.location;

	const getActiveClass = (name) => {
		const currentHash = '#/settings/' + name;
		const searchHash = hash === '#/settings' ? '#/settings/general' : hash;

		if (isEqual(searchHash, currentHash)) {
			return 'gufo-font-medium gufo-text-gray-900';
		}

		return '';
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

	// return (
	// 	<aside className="gufo-py-6 gufo-px-2 sm:gufo-px-6 lg:gufo-col-span-3 lg:gufo-py-0 lg:gufo-px-0">
	// 		<nav className="gufo-gufo-space-y-1">
	// 			<a
	// 				onClick={() => onSelect('general')} {...getActive('general')}
	// 				className="gufo-cursor-pointer gufo-bg-gray-50 gufo-text-indigo-700 hover:gufo-text-indigo-700 hover:gufo-bg-white gufo-group gufo-rounded-md gufo-px-3 gufo-py-2 gufo-flex gufo-items-center gufo-text-sm gufo-font-medium"
	// 				aria-current="page"
	// 			>
	// 				<svg className="gufo-text-indigo-500 group-hover:gufo-text-indigo-500 gufo-flex-shrink-0 gufo--ml-1 gufo-mr-3 gufo-h-6 gufo-w-6"
	// 					 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
	// 					 stroke="currentColor" aria-hidden="true">
	// 					<path strokeLinecap="round" strokeLinejoin="round"
	// 						  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"/>
	// 				</svg>
	// 				<span className="gufo-truncate">General</span>
	// 			</a>
	//
	// 			<a onClick={() => onSelect('import')} {...getActive('import')}
	// 			   className="gufo-cursor-pointer gufo-text-gray-900 hover:gufo-text-gray-900 hover:gufo-bg-gray-50 gufo-group gufo-rounded-md gufo-px-3 gufo-py-2 gufo-flex gufo-items-center gufo-text-sm gufo-font-medium">
	// 				<svg className="gufo-text-gray-400 group-hover:gufo-text-gray-500 gufo-flex-shrink-0 gufo--ml-1 gufo-mr-3 gufo-h-6 gufo-w-6"
	// 					 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
	// 					 stroke="currentColor" aria-hidden="true">
	// 					<path strokeLinecap="round" strokeLinejoin="round"
	// 						  d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"/>
	// 				</svg>
	// 				<span className="gufo-truncate">Import</span>
	// 			</a>
	// 		</nav>
	// 	</aside>
	// );

	const basicClass = "gufo-cursor-pointer gufo-text-gray-900 hover:gufo-text-gray-900 hover:gufo-bg-gray-50 hover:gufo-text-gray-900 hover:gufo-bg-gray-50 gufo-group gufo-rounded-md gufo-px-3 gufo-py-2 gufo-flex gufo-items-center gufo-text-sm ";

	return (
		<aside className="gufo-py-6 gufo-px-2 sm:gufo-px-6 lg:gufo-col-span-3 lg:gufo-py-0 lg:gufo-px-0">
			<MenuGroup>
				<MenuItem
					onClick={() => onSelect('general')}
					className={basicClass + getActiveClass('general')}
				>
					<span className="gufo-truncate">General</span>
				</MenuItem>

				<MenuItem
					onClick={() => onSelect('import')}
					className={basicClass + getActiveClass('import')}
				>
					<span className="gufo-truncate">Import</span>
				</MenuItem>

				{map(integrations, (integration, name) => {
					const hasFields = !isEmpty(get(integration, 'fields'));

					return ( integration.enable && hasFields && (
						<MenuItem
							onClick={() => onSelect(name)}
							className={basicClass + getActiveClass('recaptcha')}
						>
							<span className="gufo-truncate">
								{integration.title}
							</span>
						</MenuItem>
					) );
				})}
			</MenuGroup>
		</aside>
	);
}

const mapStateToProps = (state) => {
	const { settings } = state;

	return { settings };
};

export default connect(mapStateToProps, null)(Sidebar);
