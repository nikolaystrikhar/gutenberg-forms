import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import PluginList from './components/pluginList';
import { isEmpty } from 'lodash';
import PluginImport from './components/pluginImport';
import { TEXT_DOMAIN } from '../../../../contants';

const { __ } = wp.i18n;

/**
 * All available imports from 3rd party plugins like contact form
 */

function Import(props) {
	const [state, setState] = useState({
		// trying to be elaborative ;)
		selectedPluginToImportForms: null,
	});

	/**
	 * When a plugin is selected to import below function will fire.
	 * This plugin will be selected for further configuration for importing forms
	 * @param {object} plugin
	 */

	const onSelect = (plugin) => {
		// updating the selected plugin

		setState({ ...state, selectedPluginToImportForms: plugin });
	};

	const onExit = () => {
		// going back to the plugin lists screen
		setState({ ...state, selectedPluginToImportForms: null });
	};

	const { selectedPluginToImportForms } = state;

	return (
		<div className="cwp_plugin_import_root">
			<div
				style={{
					display: isEmpty(selectedPluginToImportForms)
						? 'block'
						: 'none',
				}}
			>
				<PluginList onSelect={onSelect} />
			</div>
			{!isEmpty(selectedPluginToImportForms) && (
				<PluginImport
					onExit={onExit}
					plugin={selectedPluginToImportForms}
				/>
			)}
		</div>
	);
}

export default withRouter(Import);
