import React from 'react';
import IntegrationBlock from '../../components/integration-block';
import { map, isEmpty, get } from 'lodash';
import { connect } from 'react-redux';
import { Snackbar } from '@wordpress/components';
import { parseSettingStatus } from '../../functions';
import InstallIntegrations from './components/install_integrations';
const { __ } = wp.i18n;

function Integrations(props) {
	const { integrations, loading } = props.settings;

	return (
		<div className="gufo-bg-white gufo-rounded-lg gufo-p-6">
			<h3 className="gufo-mb-5 gufo-text-lg gufo-font-normal gufo-leading-6 gufo-text-gray-900">
				{__('Installed', 'forms-gutenberg')}
			</h3>

			<div className="integrations_root">
				<div className="integrations_blocks">
					{map(integrations, (integration, name) => {
						const {
							title,
							banner,
							description,
							fields,
							enable,
							guide,
							is_pro,
						} = integration;

						const is_disabled = get(integration, 'is_disabled');
						const error = get(integration, 'error');
						const guide_url = get(integration, 'guide_url');

						return (
							<IntegrationBlock
								{...props}
								guide={guide}
								integration={name}
								fields={fields}
								enabled={enable}
								guide_url={guide_url}
								title={title}
								description={description}
								image={banner}
								is_pro={is_pro}
								is_disabled={is_disabled}
								error={error}
								key={title}
							/>
						);
					})}
				</div>
			</div>

			<div className="more_integrations_block">
				<InstallIntegrations />
			</div>

			<div className="cwp_setting_status">
				{!isEmpty(loading) && (
					<Snackbar>{parseSettingStatus(loading)}</Snackbar>
				)}
			</div>
		</div>
	);
}

const mapStateToProps = (state) => {
	const { settings } = state;

	return {
		settings,
	};
};

export default connect(mapStateToProps, null)(Integrations);
