import React from 'react';
import { RangeControl, PanelBody } from '@wordpress/components';
import { hasChildBlocks } from '../../block/functions';

const { InspectorControls, InnerBlocks } = wp.blockEditor;
const { __ } = wp.i18n;
const $ = jQuery;

function edit( props ) {
	const { width } = props.attributes;
	const { setAttributes, clientId } = props;

	const updateAttribute = ( key, value ) => {
		const currentBlockId = '#block-'.concat( clientId );
		const currentBlockElement = $( currentBlockId );

		if ( key === 'width' && currentBlockElement.length ) {
			const widthInPercentage = String( value ).concat( '%' );
			currentBlockElement.css( 'flex-basis', widthInPercentage ); // updating the dom width
		}

		setAttributes( {
			[ key ]: value,
		} );
	};

	return [
		// eslint-disable-next-line react/jsx-key
		<div className="cwp-col">
			<InnerBlocks
				templateLock={ false }
				className="cwp-col_inserter"
				renderAppender={
					hasChildBlocks( clientId ) ?
						undefined :
						() => <InnerBlocks.ButtonBlockAppender />
				}
			/>
		</div>,
		null,
		!! props.isSelected && (
			<InspectorControls>
				<PanelBody
					initialOpen={ true }
					title={ __( 'Column Settings', "forms-gutenberg" ) }
				>
					<RangeControl
						value={ width }
						label={ __( 'Width (%)', "forms-gutenberg" ) }
						onChange={ ( newWidth ) => updateAttribute( 'width', newWidth ) }
					/>
				</PanelBody>
			</InspectorControls>
		),
	];
}

export default edit;
