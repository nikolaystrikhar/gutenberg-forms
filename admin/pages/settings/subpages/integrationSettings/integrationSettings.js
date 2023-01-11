import React from 'react';
import { connect } from 'react-redux';
import Fields from './components/fields';
import { has, get, isEmpty } from 'lodash';

function IntegrationSettings(props) {
	const { hash } = props.location;
	const { integrations } = props.settings;

	const getName = () => {
		const queries = hash.split('/');

		const name = queries[queries.length - 1];

		return name;
	};

	const hasIntegration = has(integrations, getName());

	const hasFields =
		has(integrations, getName()) &&
		!isEmpty(get(integrations[getName()], 'fields'));

	return (
		<div>
			{hasIntegration && hasFields && <Fields integration={getName()} />}
		</div>
	);
}

const mapStateToProps = (state) => {
	return {
		settings: state.settings,
	};
};

export default connect(mapStateToProps, null)(IntegrationSettings);
