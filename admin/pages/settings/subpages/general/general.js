import React from 'react';
import Messages from './components/messages';
import { Button } from '@wordpress/components';
import { connect } from 'react-redux';
import { saveSettings } from '../../../../redux/actions/generalSettings/saveSettings';

function General(props) {
	const { saveSettings } = props;

	return (
		<div className="cwp_general_settings_root">
			<Messages />
			<div className="cwp_general_settings_root_save">
				<Button isPrimary onClick={saveSettings}>
					Save Settings
				</Button>
			</div>
		</div>
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
