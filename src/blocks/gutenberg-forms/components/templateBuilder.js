import React, { useRef, useState, useEffect } from 'react';
import { map, isEmpty, has } from 'lodash';
import { Fragment } from '@wordpress/element';
import {
	DropdownMenu,
	MenuGroup,
	MenuItem,
	Icon,
	Button,
} from '@wordpress/components';
import { getFieldIcon, serializeFields } from '../../../block/misc/helper';
import $ from 'jquery';
const { getBlock } = wp.data.select( 'core/block-editor' );

function TemplateBuilder( prop ) {
	const props = prop.data;

	const { clientId } = props,
		{ template, email, fromEmail, templateBuilder } = props.attributes;

	const root = getBlock( props.clientId );

	const child_fields = ! isEmpty( root ) ? root.innerBlocks : [];

	const handleChange = ( e, t ) => {
		const v = e.target.value;

		props.setAttributes( {
			template: JSON.stringify( { ...JSON.parse( template ), [ t ]: v } ),
		} );
	};

	const bodyArea = useRef(),
		subjectArea = useRef();

	const subject = JSON.parse( template ).subject;
	const body = JSON.parse( template ).body;

	const bodyId = 'cwp-body-' + clientId + 'body';

	useEffect( () => {
		if ( isEmpty( subject ) && isEmpty( body ) ) {
			const fields = serializeFields( child_fields ).map( v => {
				return '{{' + v.field_id + '}}';
			} );

			props.setAttributes( {
				template: JSON.stringify( {
					subject: 'New Form Submission',
					body: ` Form Data: \n ${ fields.join( '\n' ) } `,
				} ),
			} );
		}
	}, [] );

	const [ currentForm, setCurrentForm ] = useState( 'subject' );

	const addFieldId = name => {
		const $txt = $(
			currentForm === 'subject' ? subjectArea.current : bodyArea.current
		);
		const caretPos = $txt[ 0 ].selectionStart;
		const textAreaTxt = $txt.val();
		const txtToAdd = `{{${ name }}}`;

		const val =
			textAreaTxt.substring( 0, caretPos ) +
			txtToAdd +
			textAreaTxt.substring( caretPos );

		if ( currentForm === 'subject' ) {
			props.setAttributes( {
				template: JSON.stringify( {
					...JSON.parse( template ),
					subject: val,
				} ),
			} );
		} else {
			props.setAttributes( {
				template: JSON.stringify( {
					...JSON.parse( template ),
					body: val,
				} ),
			} );
		}
	};

	return (
		<div className="cwp-template-builder">
			<h3>
				<Icon icon="email" size="40" /> Email Builder
			</h3>
			<p>
				This is where you can edit the template that will be sent to the email
				Address. If no email is entered then the email will by default sent to
				the admin email!
			</p>
			<div className="cwp_data_drop">
				<span>Field Data</span>
				<DropdownMenu icon="list-view" label="Add Field Data">
					{ ( { onClose } ) => (
						<Fragment>
							<MenuGroup>
								{ map( serializeFields( child_fields ), field => {
									const { fieldName, field_id, blockName } = field;

									return (
										<MenuItem
											icon={ getFieldIcon( blockName ) }
											onClick={ () => {
												onClose();
												addFieldId( field_id );
											} }
										>
											<span draggable={ true }>{ fieldName.toLowerCase() }</span>
										</MenuItem>
									);
								} ) }
							</MenuGroup>
						</Fragment>
					) }
				</DropdownMenu>
			</div>

			<div className="cwp-builder-field">
				<label>To</label>
				<input
					value={ email }
					onChange={ e => props.setAttributes( { email: e.target.value } ) }
				/>
			</div>

			{/*<div className="cwp-builder-field">*/}
			{/*	<label>From</label>*/}
			{/*	<input*/}
			{/*		value={ fromEmail }*/}
			{/*		onChange={ e => props.setAttributes( { fromEmail: e.target.value } ) }*/}
			{/*	/>*/}
			{/*</div>*/}
			<div className="cwp-builder-field">
				<label>
					Subject <span>*</span>
				</label>
				<input
					ref={ subjectArea }
					onClick={ () => setCurrentForm( 'subject' ) }
					value={ subject }
					onChange={ e => handleChange( e, 'subject' ) }
				/>
			</div>

			<div className="cwp-builder-field">
				<label>
					Body <span>*</span>
				</label>
				<textarea
					id={ clientId.concat( 'body' ) }
					ref={ bodyArea }
					value={ body }
					onClick={ () => setCurrentForm( 'body' ) }
					onChange={ e => {
						handleChange( e, 'body' );
					} }
				></textarea>
			</div>

			<div className="cwp-save_template">
				<Button
					isPrimary
					onClick={ () => {
						props.setAttributes( { templateBuilder: ! templateBuilder } );
					} }
				>
					Save
				</Button>
			</div>
		</div>
	);
}

export default TemplateBuilder;
