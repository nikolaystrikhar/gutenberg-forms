import React, { useRef, useState, useEffect } from 'react';
import { map, isEmpty, has } from 'lodash';
import { Fragment } from '@wordpress/element';
import {
	DropdownMenu,
	MenuGroup,
	MenuItem,
	Icon,
	Button,
	TextControl,
	TextareaControl
} from '@wordpress/components';
import { getFieldIcon, serializeFields } from '../../../block/misc/helper';
import $ from 'jquery';
import { TEXT_DOMAIN } from '../../../block/constants';
const { getBlock } = wp.data.select('core/block-editor');

const { __ } = wp.i18n;

function TemplateBuilder(prop) {
	const props = prop.data;

	const { clientId } = props,
		{ template, email, fromEmail, templateBuilder } = props.attributes;

	const root = getBlock(props.clientId);

	const child_fields = !isEmpty(root) ? root.innerBlocks : [];

	const handleChange = (value, t) => {
		props.setAttributes({
			template: JSON.stringify({ ...JSON.parse(template), [t]: value }),
		});
	};

	const bodyArea = useRef(),
		subjectArea = useRef();

	const subject = JSON.parse(template).subject;
	const body = JSON.parse(template).body;

	const bodyId = 'cwp-body-' + clientId + 'body';

	useEffect(() => {
		if (isEmpty(subject) && isEmpty(body)) {

			props.setAttributes({
				template: JSON.stringify({
					subject: 'New Form Submission',
					body: `{{all_data}}`,
				}),
			});
		}
	}, []);

	const [currentForm, setCurrentForm] = useState('subject');

	//? getting the logged in user email address with the help of localize script
	const adminEmail = !isEmpty(cwpGlobal.admin_email) ? cwpGlobal.admin_email : "";

	const addFieldId = name => {
		const $txt = $(
			currentForm === 'subject' ? subjectArea.current : bodyArea.current
		);


		const text_field = $txt.find('input, textarea');

		const caretPos = text_field[0].selectionStart;
		const textAreaTxt = text_field.val();
		const txtToAdd = `{{${name}}}`;

		const val =
			textAreaTxt.substring(0, caretPos) +
			txtToAdd +
			textAreaTxt.substring(caretPos);

		if (currentForm === 'subject') {
			props.setAttributes({
				template: JSON.stringify({
					...JSON.parse(template),
					subject: val,
				}),
			});
		} else {
			props.setAttributes({
				template: JSON.stringify({
					...JSON.parse(template),
					body: val,
				}),
			});
		}
	};

	return (
		<div className="cwp-template-builder">
			<div className="cwp_data_drop">
				<span><strong>Field Data</strong></span>
				<DropdownMenu icon="list-view" label="Add Field Data">
					{({ onClose }) => (
						<Fragment>
							<MenuGroup>
								<MenuItem
									info="Insert All fields"
									icon='clipboard'
									onClick={() => {
										onClose();
										addFieldId('all_data');
									}}
								>
									<span draggable={true}>All Data</span>
								</MenuItem>
								{map(serializeFields(child_fields), field => {
									const { fieldName, field_id, blockName } = field;

									const field_label = isEmpty(fieldName) ? field_id : fieldName;

									return (
										<MenuItem
											icon={getFieldIcon(blockName)}
											onClick={() => {
												onClose();
												addFieldId(field_id);
											}}
										>
											<span draggable={true}>{field_label.toLowerCase()}</span>
										</MenuItem>
									);
								})}

							</MenuGroup>
						</Fragment>
					)}
				</DropdownMenu>
			</div>

			<div className="cwp-builder-field">
				<TextControl
					label={__("From", TEXT_DOMAIN)}
					value={fromEmail}
					placeholder={__("Name, Email", TEXT_DOMAIN)}
					onChange={fromEmail => props.setAttributes({ fromEmail })}
				/>
			</div>

			<div className="cwp-builder-field">
				<TextControl
					label={__("To", TEXT_DOMAIN)}
					value={email}
					placeholder={adminEmail}
					onChange={email => props.setAttributes({ email: email })}
				/>
			</div>

			<div ref={subjectArea}>
				<TextControl
					label={__("Subject", TEXT_DOMAIN)}
					onClick={() => setCurrentForm('subject')}
					value={subject}
					onChange={subject => handleChange(subject, 'subject')}
				/>
			</div>

			<div ref={bodyArea}>
				<TextareaControl
					label={__("Body", TEXT_DOMAIN)}
					id={clientId.concat('body')}
					value={body}
					onClick={() => setCurrentForm('body')}
					onChange={body => handleChange(body, 'body')}
				/>
			</div>
		</div>
	);
}

export default TemplateBuilder;
