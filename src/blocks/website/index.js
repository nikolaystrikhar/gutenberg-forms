const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

import websiteEdit from './edit.js';
import websiteSave from './save.js';
import { getFieldTransform } from '../../block/functions';
import { fieldParents, myAttrs } from '../../constants';

registerBlockType("cwp/website", {
	title: __("Website"),
	icon: "laptop",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("website")],
	edit: websiteEdit,
	save: websiteSave,
	attributes: {
		enableCondition: {
			type: "boolean",
			default: false
		},
		website: {
			type: "string",
			default: ""
		},
		isRequired: {
			type: "boolean",
			default: false
		},
		label: {
			type: "string",
			default: "Website"
		},
		id: {
			type: "string",
			default: ""
		},
		field_name: {
			type: "string",
			default: ""
		},
		requiredLabel: {
			type: "string",
			default: "*"
		},
		messages: {
			type: "object",
			default: {
				empty: "Please fill out this field!",
				invalid: "The website {{value}} is not valid!"
			}
		},
		condition: {
			type: "object",
			default: {
				field: null,
				condition: "===",
				value: ""
			}
		},
		requiredLabel: {
			type: "string",
			default: "*"
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
				type: "block",
				blocks: myAttrs.map(block => "cwp/".concat(block)),
				transform: a => getFieldTransform(a, "website")
			}
		]
	},
	parent: fieldParents
});
