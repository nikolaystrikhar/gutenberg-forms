import React, { Fragment } from 'react';
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
		<Fragment>
			<div className="cwp_settings_root">
				<Sidebar {...props} isResponsive={false} />
				<Sidebar {...props} isResponsive={true} />
				<div className="cwp_settings_fields_root">
					<CurrentSettings />
				</div>
			</div>
			{!isEmpty(loading) && (
				<Snackbar className="cwp_load">
					{parseSettingStatus(loading)}
				</Snackbar>
			)}
		</Fragment>
	);
}

const mapStateToProps = (state) => {
	return {
		settings: state.settings,
	};
};

export default connect(mapStateToProps, null)(Settings);
