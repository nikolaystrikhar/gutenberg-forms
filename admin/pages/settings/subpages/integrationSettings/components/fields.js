import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
	TextControl,
	Button,
	IconButton,
	Guide,
	GuidePage,
} from '@wordpress/components';
import { map, clone, each, has, isEmpty, get, isFunction } from 'lodash';
import { TEXT_DOMAIN } from '../../../../../contants';
import { setIntegrationDetails } from '../../../../../redux/actions/settings/setIntegrationDetails';
import { parse_guide } from '../../../../../functions';

const { __ } = wp.i18n;

function Fields(props) {
	const currentIntegration = props.settings.integrations[props.integration];
	const FieldSlot = get(
		window,
		`cwp_gf.extend.settings.integrations.fields.${props.integration}.Slot`
	);

	const fields = currentIntegration.fields;

	const [text_fields, setFields] = useState({
		fields,
	});

	const [info, set_info] = useState(false);

	const handleFieldChange = (key, value) => {
		text_fields.fields[key].value = value;

		setFields({
			...text_fields,
		});
	};

	const clearSettings = () => {
		let new_fields = clone(text_fields);

		each(new_fields.fields, (field) => {
			if (has(field, 'value')) {
				field.value = '';
			}
		});

		setFields({
			fields: new_fields.fields,
		});

		saveSettings();
	};

	const saveSettings = () => {
		props.setIntegrationDetails(fields, props.integration);
	};

	if (currentIntegration.enable) {
		return (
			<div className="cwp_integ_fields">
				<h3 className="gufo-text-lg gufo-font-normal gufo-leading-6 gufo-text-gray-900">
					{currentIntegration.title} {__('Settings', 'forms-gutenberg')}
					<IconButton onClick={() => set_info(true)} icon="info" />
				</h3>
				<p className="gufo-mt-1 gufo-mb-5 gufo-max-w-2xl gufo-text-sm gufo-text-gray-500"
					dangerouslySetInnerHTML={{
						__html: currentIntegration.description,
					}}
				></p>
				{isFunction(FieldSlot) && <FieldSlot bubblesVirtually />}
				{map(text_fields.fields, (field, key) => {
					const { label, value } = field;
					const fieldType = get(field, 'field_type');
					const field_type_final = isEmpty(fieldType)
						? 'password'
						: fieldType;
					const is_hidden = get(field, 'hide_field');
					const is_field_hidden =
						typeof is_hidden === 'undefined' ? false : is_hidden;

					return (
						is_field_hidden === false && (
							<div className="cwp_api_field">
								<TextControl
									className="api_input"
									type={field_type_final}
									value={value}
									onChange={(val) =>
										handleFieldChange(key, val)
									}
									key={key}
									label={__(label, TEXT_DOMAIN)}
								/>
							</div>
						)
					);
				})}
				<div className="cwp_setting_options">
					<Button isDefault onClick={clearSettings}>
						Clear Settings
					</Button>
					<Button isPrimary onClick={saveSettings}>
						Save Settings
					</Button>
				</div>
				{info && (
					<Guide onFinish={() => set_info(false)}>
						{map(
							parse_guide(currentIntegration.guide),
							(markup, index) => {
								return (
									<GuidePage className="cwp_guide">
										<div
											dangerouslySetInnerHTML={{
												__html: markup,
											}}
										></div>
									</GuidePage>
								);
							}
						)}
					</Guide>
				)}
			</div>
		);
	} else {
		return null;
	}
}

const mapStateToProps = (state) => {
	return {
		settings: state.settings,
	};
};

const mapDispatchToProps = {
	setIntegrationDetails,
};

export default connect(mapStateToProps, mapDispatchToProps)(Fields);
