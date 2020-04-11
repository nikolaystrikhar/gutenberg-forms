import React, { useEffect, Fragment } from 'react';
import {
	FormToggle,
	Toolbar,
	PanelRow,
	PanelBody,
	TextControl,
	Icon,
} from '@wordpress/components';

import {
	getFieldName,
	extract_id,
	getEncodedData,
	extract_admin_id,
	get_admin_id,
} from '../../block/misc/helper';

import { clone, set, assign } from 'lodash';
import { getRootMessages, detect_similar_forms } from '../../block/functions/index';
import ConditionalLogic from '../../block/components/condition';
import { TEXT_DOMAIN } from '../../block/constants';
const { __ } = wp.i18n;

const {
	InspectorControls,
	BlockControls,
	RichText,
} = wp.blockEditor;

function edit(props) {
	const handleChange = e => {
		const email = e.target.value;

		props.setAttributes({ email });
	};

	const handleRequired = () => {
		const { isRequired } = props.attributes;

		props.setAttributes({ isRequired: !isRequired });
	};

	const handleLabel = label => {
		props.setAttributes({ label });
	};

	const {
		email,
		isRequired,
		label,
		id,
		field_name,
		requiredLabel,
		messages: { empty, invalidEmail },
		messages,
		condition,
		enableCondition,
		adminId
	} = props.attributes;

	const getRootData = () => {
		if (field_name === '' || detect_similar_forms(props.clientId)) {


			const newFieldName = getFieldName('email', props.clientId);

			props.setAttributes({
				field_name: newFieldName,
				adminId: {
					value: extract_admin_id(newFieldName, 'email'),
					default: extract_admin_id(newFieldName, 'email')
				}
			});

			props.setAttributes({
				id:
					props.clientId +
					'__' +
					getEncodedData('email', props.clientId, isRequired, get_admin_id(adminId)),
			});
		} else if (field_name !== '') {
			props.setAttributes({
				id:
					extract_id(field_name) +
					'__' +
					getEncodedData('email', extract_id(field_name), isRequired, get_admin_id(adminId)),
			});
		}

	};

	useEffect(() => {
		const rootMessages = getRootMessages(props.clientId, 'email');

		if (rootMessages) {
			const newMessages = clone(messages);

			assign(newMessages, rootMessages);

			props.setAttributes({ messages: newMessages });
		}

		getRootData();
	}, []);

	useEffect(() => getRootData(), [props]);

	const setMessages = (type, m) => {
		const newMessages = clone(messages);

		set(newMessages, type, m);

		props.setAttributes({ messages: newMessages });
	};

	const handleAdminId = (id) => {
		props.setAttributes({
			adminId: {
				...adminId,
				value: id.replace(/\s|-/g, "_")
			}
		})
	}

	return [
		!!props.isSelected && (
			<InspectorControls>
				<PanelBody title={__('Field Settings', TEXT_DOMAIN)} initialOpen={true}>

					<div className="cwp-option">
						<TextControl
							placeholder={adminId.default}
							label={__("Field ID", TEXT_DOMAIN)}
							value={adminId.value}
							onChange={handleAdminId}
						/>
					</div>

					{!enableCondition ? (
						<PanelRow>
							<h3 className="cwp-heading">{__('Required', TEXT_DOMAIN)}</h3>
							<FormToggle
								label="Required"
								checked={isRequired}
								onChange={handleRequired}
							/>
						</PanelRow>
					) : (
							<div className="cwp-option">
								<p>
									<Icon icon="info" /> {__('You cannot set a conditional field required!', TEXT_DOMAIN)}
								</p>
							</div>
						)}
					{isRequired && (
						<Fragment>
							<div className="cwp-option">
								<h3 className="cwp-heading">{__('Required Text', TEXT_DOMAIN)}</h3>
								<TextControl
									onChange={label =>
										props.setAttributes({ requiredLabel: label })
									}
									value={requiredLabel}
								/>
							</div>
						</Fragment>
					)}

				</PanelBody>
				<PanelBody title={__('Messages', TEXT_DOMAIN)}>
					{isRequired && (
						<div className="cwp-option">
							<h3 className="cwp-heading">{__('Required Error', TEXT_DOMAIN)}</h3>
							<TextControl
								onChange={label => setMessages('empty', label)}
								value={empty}
							/>
						</div>
					)}
					<div className="cwp-option">
						<h3 className="cwp-heading">{__('Invalid Email Error', TEXT_DOMAIN)}</h3>
						<TextControl
							onChange={v => setMessages('invalidEmail', v)}
							value={invalidEmail}
						/>
					</div>
					<div className="cwp-option">
						<p>
							<Icon icon="info" /> {__('Use {{value}} to insert field value!', TEXT_DOMAIN)}
						</p>
					</div>
				</PanelBody>
				<PanelBody title={__('Condition', TEXT_DOMAIN)}>
					<ConditionalLogic
						condition={condition}
						set={props.setAttributes}
						clientId={props.clientId}
						useCondition={props.attributes.enableCondition}
					/>
				</PanelBody>
			</InspectorControls>
		),
		!!props.isSelected && <BlockControls></BlockControls>,
		<div className={`cwp-email cwp-field ${props.className}`}>
			{!!props.isSelected && !enableCondition && (
				<div className="cwp-required">
					<h3>{__('Required', TEXT_DOMAIN)}</h3>
					<FormToggle checked={isRequired} onChange={handleRequired} />
				</div>
			)}

			<div className="cwp-field-set">
				<div className="cwp-label-wrap">
					<RichText tag="label" value={label} onChange={handleLabel} />
					{!props.isSelected && isRequired && !enableCondition && (
						<div className="cwp-required cwp-noticed">
							<h3>{requiredLabel}</h3>
						</div>
					)}
				</div>
				<input value={email} onChange={handleChange} />
			</div>
		</div>,
	];
}

export default edit;
