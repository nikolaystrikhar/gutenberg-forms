const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import nameEdit from './edit.js';
import nameSave from './save.js';
import { getFieldTransform } from '../../block/functions';
import { fieldParents, myAttrs } from '../../constants';

registerBlockType('cwp/name', {
	title: __('Name'),
	icon: 'admin-users',
	category: 'common',
	keywords: [__('gutenberg-forms'), __('forms'), __('name')],
	edit: nameEdit,
	save: nameSave,
	attributes: {
		enableCondition: {
			type: 'boolean',
			default: false,
		},
		name: {
			type: 'string',
			default: '',
		},
		isRequired: {
			type: 'boolean',
			default: false,
		},
		label: {
			type: 'string',
			default: 'Name',
		},
		id: {
			type: 'string',
			default: '',
		},
		field_name: {
			type: 'string',
			default: '',
		},
		messages: {
			type: 'object',
			default: {
				empty: 'Please fill out this field!',
				invalidName: 'The name {{value}} is not valid!',
			},
		},
		pattern: {
			type: 'string',
			default: '',
		},
		condition: {
			type: 'object',
			default: {
				field: null,
				condition: '===',
				value: '',
			},
		},
		requiredLabel: {
			type: 'string',
			default: '*',
		},
		adminId: {
			type: "object",
			default: {
				default: "",
				value: ""
			}
		}
	},
	transforms: {
		from: [
			{
				type: 'block',
				blocks: myAttrs.map(block => 'cwp/'.concat(block)),
				transform: a => getFieldTransform(a, 'name'),
			},
		],
	},
	parent: fieldParents,
});
