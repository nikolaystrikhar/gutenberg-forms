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
			return 'gufo-font-medium gufo-text-gray-900 gufo-bg-gray-100';
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
							key={name}
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
