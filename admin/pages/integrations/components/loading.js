import React from 'react';
import { Spinner } from '@wordpress/components';

function Loading() {
	return (
		<div className="cwp-loading-more-integrations">
			<h1 className="light-heading">
				Finding More Available Addons / Integrations <Spinner />
			</h1>
		</div>
	);
}

export default Loading;
