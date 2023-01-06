import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import IntegrationBlock from '../../components/integration-block';
import { map, isEmpty, get } from 'lodash';
import { connect } from 'react-redux';
import { Snackbar } from '@wordpress/components';
import { parseSettingStatus } from '../../functions';
import InstallIntegrations from './components/install_integrations';

function Integrations(props) {
	const { pathname, search } = props.location;

	const { integrations, loading } = props.settings;

	return (
		<Fragment>
			<h1 className="light-heading">
				Current Installed Addons / Integrations
			</h1>
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
		</Fragment>
	);
}

const mapStateToProps = (state) => {
	const { settings } = state;

	return {
		settings,
	};
};

export default connect(mapStateToProps, null)(Integrations);
