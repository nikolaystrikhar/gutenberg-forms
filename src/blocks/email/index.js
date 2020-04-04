const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import emailEdit from './edit.js';
import emailSave from './save.js';
import { getFieldTransform } from '../../block/functions';
import { fieldParents, myAttrs } from '../../constants';

registerBlockType('cwp/email', {
	title: __('Email'),
	icon: 'email',
	category: 'common',
	keywords: [__('gutenberg-forms'), __('forms'), __('mail')],
	edit: emailEdit,
	save: emailSave,
	transforms: {
		from: [
			{
				type: 'block',
				blocks: myAttrs.map(block => 'cwp/'.concat(block)),
				transform: a => getFieldTransform(a, 'email'),
			},
		],
	},
	attributes: {
		enableCondition: {
			type: 'boolean',
			default: false,
		},
		email: {
			type: 'string',
			default: '',
		},
		isRequired: {
			type: 'boolean',
			default: false,
		},
		label: {
			type: 'string',
			default: 'Email',
		},
		id: {
			type: 'string',
			default: '',
		},
		field_name: {
			type: 'string',
			default: '',
		},
		requiredLabel: {
			type: 'string',
			default: '*',
		},
		messages: {
			type: 'object',
			default: {
				empty: 'Please fill out this field!',
				invalidEmail: 'The email {{value}} is not valid!',
			},
		},
		condition: {
			type: 'object',
			default: {
				field: null,
				condition: '===',
				value: '',
			},
		},
		adminId: {
			type: "object",
			default: {
				default: "",
				value: ""
			}
		}
	},
	parent: fieldParents,
});
