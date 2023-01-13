import React from 'react';
import { Button } from '@wordpress/components';

function FetchError(props) {
	return (
		<div className="cwp-fetch-more-addon-err">
			<h1 className="light-heading">
				Oops! Something went wrong{' '}
				<Button isPrimary onClick={props.onRetry}>
					Try Again
				</Button>
			</h1>
		</div>
	);
}

export default FetchError;
