import React from 'react';
import { InnerBlocks } from '@wordpress/block-editor';

function save( props ) {
	const width = String( props.attributes.width ).concat( '%' );

	const styling = {
		flexBasis: width,
	};

	return (
		<div className="cwp-col" style={ styling }>
			<InnerBlocks.Content />
		</div>
	);
}

export default save;
