import { strip_tags, extract_id } from "../misc/helper";
import { each, has, omit, isEqual, clone, assign, isEmpty, get } from "lodash";
const { createBlock } = wp.blocks;
const {
	getBlock,
	getBlockRootClientId,
	getBlockHierarchyRootClientId
} = wp.data.select("core/block-editor");
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

	if (has(attrs, "condition")) {
		config["condition"] = attrs["condition"];
		config.enableCondition = attrs.enableCondition;
	}

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
	},
	{
		fieldName: "number",
		empty: "Please fill out this field!",
		invalid: "The number {{value}} is not in range!"
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
	const rootForms = getBlockHierarchyRootClientId(clientId);
	const rootBlock = getBlock(rootForms);

	if (rootBlock.name !== "cwp/block-gutenberg-forms") return false;

	let { messages } = rootBlock.attributes;
	const defaultMessage = messages.find(v => v.fieldName === blockName);

	return defaultMessage;
}

export function getChildAttributes(clientId) {
	const rootBlock = getBlock(clientId); //i.e = gutenberg-forms;
	let childAttrs = [];

	if (!has(rootBlock, "innerBlocks")) return childAttrs;

	rootBlock.innerBlocks.forEach(v => {
		if (has(v, "attributes")) {
			childAttrs.push(v["attributes"]);
		} else if (layoutBlocks.includes(v.name)) {
			//which means field are nested even more!
			childAttrs.push(...getChildAttributes(v.clientId));
		}
	});

	return childAttrs;
}

export function getSiblings(clientId, slug = null) {
	const block = getBlockHierarchyRootClientId(clientId),
		rootBlock = getBlock(block); //i.e = gutenberg-forms;

	if (
		rootBlock.name !== "cwp/block-gutenberg-forms" &&
		has(rootBlock, "innerBlocks")
	)
		return false;

	let siblingValues = [];

	rootBlock.innerBlocks.forEach(v => {
		const breaked = v.name.split("/");

		const conditions = {
			isCakewpBlock: v.name.startsWith("cwp/"), //ensuring that this is our block!
			isFieldBlock: myAttrs.includes(breaked[breaked.length - 1]), //ensuring that it is a gutenberg-form field;
			isLayoutBlock: layoutBlocks.includes(v.name), //ensuring that it is not a layout block
			currentBlock: v.clientId === clientId //ensuring that this is not the block
		};

		if (
			conditions.isCakewpBlock &&
			conditions.isFieldBlock &&
			!conditions.isLayoutBlock &&
			!conditions.currentBlock
		) {
			if (slug === null) {
				siblingValues.push(v.attributes);
			} else if (slug === v.name) {
				//for specified block fields
				siblingValues.push(v.attributes);
			}
		} else if (conditions.isLayoutBlock) {
			siblingValues.push(...getChildAttributes(v.clientId)); //getting inner fields in layout blocks
		}
	});

	return siblingValues;
}

export function stringifyCondition(c) {
	return JSON.stringify(c);
}

export function isChildFieldsRequired(clientId) {
	const childs = getChildAttributes(clientId);
	let res = false;

	childs.forEach(child => {
		if (child.isRequired) {
			res = true;
		}
	});

	return res;
}

export function detectSimilarFields(clientId, field_id) {
	//this will detect the similar id across fields

	const root = getBlock(getBlockHierarchyRootClientId(clientId));
	let result = false;

	if (!has(root, "innerBlocks")) return;

	root.innerBlocks.forEach(block => {
		let { attributes } = block;

		if (layoutBlocks.includes(block.name)) {
			result = detectSimilarFields(block);
		} else {
			if (has(attributes, "field_name")) {
				if (
					isEqual(get(attributes, "field_name"), field_id) &&
					!isEqual(block.clientId, clientId)
				) {
					result = true;
				}
			}
		}
	});

	return result;
}
