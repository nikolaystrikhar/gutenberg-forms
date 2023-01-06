import React from 'react';
import { Link } from 'react-router-dom';
import Information from './data_components/information';
import { PanelBody } from '@wordpress/components';

function Dashboard(props) {
	const { pathname, search } = props.location;

	return (
		<div className="cwp_dashboard_root">
			<Information />
		</div>
	);
}

export default Dashboard;
