import React, { Fragment, useEffect } from 'react';
import { TEXT_DOMAIN } from '../../../block/constants';
import FieldPlotter from './fieldPlotter';
import { get, isEqual, map, each, includes, clone, omit } from 'lodash';

const { __ } = wp.i18n;
const { PanelBody } = wp.components;

function Integrations( props ) {
	const integrations = get( window, 'cwpGlobal.settings.integrations' );
	const savedIntegrations = props.data.attributes.integrations;
	const { actions } = props.data.attributes;

	// responsible for keeping the form actions and integrations synchronized
	useEffect( () => {
		each( savedIntegrations, ( integration, name ) => {
			const title = get( integrations[ name ], 'title' );

			const hasActionOfCurrentIntegration = includes( actions, title ); // checking if the action has current integration

			if ( ! hasActionOfCurrentIntegration ) {
				const newIntegrations = clone( savedIntegrations );
				const withoutCurrentIntegrations = omit( newIntegrations, [ name ] ); // deleting the current integration from the list

				props.data.setAttributes( { integrations: withoutCurrentIntegrations } );
			}
		} );
	}, [ actions ] );

	return (
		<Fragment>
			{ map( integrations, ( integration, name ) => {
				const api_fields = get( integration, 'api_fields' ),
					query_fields = get( integration, 'query_fields' ),
					title = get( integration, 'title' ),
					enable = get( integration, 'enable' ),
					fields = get( integration, 'fields' ),
					type = get( integration, 'type' );
				if (
					enable &&
					actions.includes( title ) &&
					isEqual( type, 'autoResponder' )
				) {
					return (
						<PanelBody title={ __( title, TEXT_DOMAIN ) }>
							<FieldPlotter
								fields={ fields }
								title={ title }
								name={ name }
								data={ props.data }
								clientId={ props.clientId }
								api_fields={ api_fields }
								query_fields={ query_fields }
							/>
						</PanelBody>
					);
				}
			} ) }
		</Fragment>
	);
}

export default Integrations;
