import React, { Fragment } from 'react';
import Logo from '../components/logo';
import Navigation from './Navigation';
import { withRouter } from 'react-router-dom';
import { get, startsWith } from 'lodash';
import { TEXT_DOMAIN } from '../contants';
import { extractFormId } from '../pages/entries/utils';
const { __ } = wp.i18n;

function Header(props) {
	const { hash } = props.location;
	const hashBraces = hash.split('/');
	const lastHash = get(hashBraces, hashBraces.length - 1);

	const isSingleFormEntriesPage =
		startsWith(lastHash, 'form-') || startsWith(lastHash, 'summary');

	const form_id = extractFormId(hash);

	const singleEntryNavs = [
		{
			name: `#/entries/${form_id}`,
			title: __('Entries Table', TEXT_DOMAIN),
		},
		{
			name: `#/entries/summary/${form_id}`,
			title: __(
				<span>
					Entries Summary <span className="cwp-nav-imp">BETA</span>
				</span>,
				TEXT_DOMAIN
			),
		},
	];

	return (
		<Fragment>
			<div className="cwp-header">
				<div className="cwp_header_content">
					<div className="logo">
						<Logo />
					</div>
					<Navigation {...props} />
				</div>
			</div>
			{isSingleFormEntriesPage && (
				<div className="cwp-header sub-header">
					<Navigation tabs={singleEntryNavs} />
				</div>
			)}
		</Fragment>
	);
}

export default withRouter(Header);
