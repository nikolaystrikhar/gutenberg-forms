import { strip_tags } from "../misc/helper";
import { each, has, omit, isEqual, clone, assign } from "lodash";
const { createBlock } = wp.blocks;
const { getBlock, getBlockRootClientId, getBlockParents } = wp.data.select(
	"core/block-editor"
);
const { updateBlockAttributes } = wp.data.dispatch("core/block-editor");

const radio_enabled_fields = ["select", "radio", "checkbox"]; //fields that support multiple

const myAttrs = [
	"email",
	"name",
	"message",
	"checkbox",
	"datepicker",
	"radio",
	"phone",
	"website",
	"text",
	"select",
	"number"
];

//?custom-function for fields_transformation purpose;
export const getFieldTransform = (attrs, field) => {
	const matchedKey = myAttrs.find(prop => prop in attrs);
	const fieldBlock = "cwp/".concat(field);

	const config = {
		isRequired: attrs.isRequired,
		[field]: attrs[matchedKey]
	};

	if (
		!myAttrs.includes(strip_tags(attrs.label.toLowerCase())) &&
		strip_tags(attrs.label) !== "Choose One"
	) {
		//when the label has changed...
		config.label = attrs.label;
	}

	if (radio_enabled_fields.includes(field) && attrs.options) {
		//^^^ This condition ensures that we are
		// 	  currently transforming from a radio_enabled_field into
		//	  another radio_enabled_field;

		config.options = attrs.options; //Like a piece of cake ;-D
	}

	return createBlock(fieldBlock, config);
};

const layoutBlocks = ["cwp/form-column", "cwp/column", "cwp/form-group"]; //blocks that will be ignored while serializing...

export const defaultFieldMessages = [
	{
		fieldName: "name",
		empty: "Please fill out this field!",
		invalidName: "The name {{value}} is not valid!"
	},
	{
		fieldName: "email",
		empty: "Please fill out this field!",
		invalidEmail: "The email {{value}} is not valid!"
	},
	{
		fieldName: "text",
		empty: "Please fill out this field!",
		invalid: "The text {{value}} is not valid!"
	},
	{
		fieldName: "message",
		empty: "Please fill out this field!",
		invalid: "The message {{value}} is not valid!"
	},
	{
		fieldName: "checkbox",
		empty: "Please select atleast one checkbox!"
	},
	{
		fieldName: "radio",
		empty: "Please select radio!"
	},
	{
		fieldName: "phone",
		empty: "Please fill out this field!",
		invalid: "The phone {{value}} is not valid!"
	},
	{
		fieldName: "website",
		empty: "Please fill out this field!",
		invalid: "The website {{value}} is not valid!"
	},
	{
		fieldName: "select",
		empty: "Please select option!"
	}
];

function isDefaultValues(blockAttrs, type, fName, messages) {
	//ensuring that the block values aren't changed!

	if (!has(blockAttrs, "messages")) return;

	let defaultMessage = messages.find(v => v.fieldName === fName);

	let statics = defaultFieldMessages.find(v => v.fieldName === fName);

	if (statics[type] === blockAttrs.messages[type]) {
		return true;
	} else if (blockAttrs.messages[type] === defaultMessage[type]) {
		return true;
	}

	return false;
}

export function changeChildValue(slug, clientId, attrs, type, messages) {
	const block = getBlock(clientId); // getting the current main parent block

	if (!has(block, "innerBlocks")) return;

	block.innerBlocks.forEach(b => {
		const targetBlock = b.name === slug;

		if (targetBlock) {
			let cId = b.clientId;

			if (isDefaultValues(b.attributes, type, attrs.fieldName, messages)) {
				updateBlockAttributes(cId, { messages: omit(attrs, "fieldName") });
			}
		} else if (layoutBlocks.includes(b.name)) {
			changeChildValue(slug, b.clientId, attrs); // recursion
		}
	});

	// return block;
}

export function getRootMessages(clientId, blockName) {
	const rootForms = getBlockParents(clientId);
	const rootBlock = getBlock(rootForms[0]);

	if (rootBlock.name !== "cwp/block-gutenberg-forms") return false;

	let { messages } = rootBlock.attributes;
	const defaultMessage = messages.find(v => v.fieldName === blockName);

	return defaultMessage;
}
