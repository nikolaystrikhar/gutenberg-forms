import React from 'react';
import Sidebar from './components/sidebar';
import General from './subpages/general/general';
import IntegrationSettings from './subpages/integrationSettings/integrationSettings';
import { connect } from 'react-redux';
import { Snackbar } from '@wordpress/components';
import { isEmpty } from 'lodash';
import { parseSettingStatus } from '../../functions';
import ImportSettingsPage from './subpages/import/index.import';

function Settings(props) {
	const { hash } = props.location;
	const { loading } = props.settings;

	const CurrentSettings = () => {
		if (hash === '#/settings/general') {
			return <General {...props} />;
		} else if (hash === '#/settings/import') {
			return <ImportSettingsPage />;
		} else if (hash === '#/settings') {
			return <General {...props} />;
		} else {
			return <IntegrationSettings {...props} />;
		}
	};

	return (
		<div className="lg:gufo-grid lg:gufo-grid-cols-12 lg:gufo-gap-x-5 gufo-bg-white gufo-rounded-lg gufo-p-6">
			<Sidebar {...props} />

			<div className="gufo-space-y-6 sm:gufo-px-6 lg:gufo-col-span-9 lg:gufo-px-0">
				<CurrentSettings />
			</div>

			{!isEmpty(loading) && (
				<Snackbar className="cwp_load">
					{parseSettingStatus(loading)}
				</Snackbar>
			)}
		</div>
	);
}

const mapStateToProps = (state) => {
	return {
		settings: state.settings,
	};
};

export default connect(mapStateToProps, null)(Settings);
