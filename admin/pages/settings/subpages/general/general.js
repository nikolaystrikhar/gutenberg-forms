import React, { Fragment } from 'react';
import Messages from './components/messages';
import { Button, Snackbar } from '@wordpress/components';
import { connect } from 'react-redux';
import { saveSettings } from '../../../../redux/actions/generalSettings/saveSettings';
import { isEmpty } from 'lodash';
import { parseSettingStatus } from '../../../../functions';

function General(props) {
	const {
		saveSettings,
		settings: { loading },
	} = props;

	return (
		<Fragment>
			<div className="cwp_general_settings_root">
				<Messages />
				<div className="cwp_general_settings_root_save">
					<Button isPrimary onClick={saveSettings}>
						Save Settings
					</Button>
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

const mapDispatchToProps = {
	saveSettings,
};

const mapStateToProps = (state) => {
	return {
		settings: state.settings,
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(General);
