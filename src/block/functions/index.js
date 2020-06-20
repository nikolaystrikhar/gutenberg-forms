import { strip_tags, extract_id, serializeFields } from "../misc/helper";
import {
	each,
	has,
	omit,
	isEqual,
	clone,
	assign,
	isEmpty,
	get,
	map,
	isArray,
	toString,
} from "lodash";

import formStepSave from "../../blocks/form-step/save";
import formStepEdit from "../../blocks/form-step/edit";
import $ from "jquery";
const { getPostType } = wp.data.select("core");
const { createBlock, registerBlockType } = wp.blocks;
const { __ } = wp.i18n;

const {
	getBlock,
	getBlockRootClientId,
	getBlockHierarchyRootClientId,
	getPreviousBlockClientId,
} = wp.data.select("core/block-editor");

const { getEditedPostAttribute } = wp.data.select("core/editor");

const { updateBlockAttributes } = wp.data.dispatch("core/block-editor");
const { withSelect } = wp.data;

const radio_enabled_fields = ["select", "radio", "checkbox"]; //fields that support multiple

export const myAttrs = [
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
	"number",
	"file-upload",
];

export function getAllowedBlocks(type) {
	const prefixed = myAttrs.map((slug) => "cwp/" + slug); // ["cwp/email" , .....];

	if (type === "multiStep") {
		prefixed.push("cwp/form-step");
	}

	return prefixed;
}

//?custom-function for fields_transformation purpose;
export const getFieldTransform = (attrs, field) => {
	const matchedKey = myAttrs.find((prop) => prop in attrs);
	const fieldBlock = "cwp/".concat(field);

	const config = {
		isRequired: attrs.isRequired,
		[field]: attrs[matchedKey],
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

const layoutBlocks = [
	"cwp/form-column",
	"cwp/column",
	"cwp/form-group",
	"cwp/form-step",
]; //blocks that will be ignored while serializing...
const miscBlocks = ["cwp/form-button"];

export const defaultFieldMessages = [
	{
		fieldName: "name",
		empty: "Please fill out this field!",
		invalidName: "The name {{value}} is not valid!",
	},
	{
		fieldName: "email",
		empty: "Please fill out this field!",
		invalidEmail: "The email {{value}} is not valid!",
	},
	{
		fieldName: "text",
		empty: "Please fill out this field!",
		invalid: "The text {{value}} is not valid!",
	},
	{
		fieldName: "message",
		empty: "Please fill out this field!",
		invalid: "The message {{value}} is not valid!",
	},
	{
		fieldName: "checkbox",
		empty: "Please select atleast one checkbox!",
	},
	{
		fieldName: "radio",
		empty: "Please select radio!",
	},
	{
		fieldName: "phone",
		empty: "Please fill out this field!",
		invalid: "The phone {{value}} is not valid!",
	},
	{
		fieldName: "website",
		empty: "Please fill out this field!",
		invalid: "The website {{value}} is not valid!",
	},
	{
		fieldName: "select",
		empty: "Please select option!",
	},
	{
		fieldName: "number",
		empty: "Please fill out this field!",
		invalid: "The number {{value}} is not in range!",
	},
	{
		fieldName: "file-upload",
		empty: "Please select a file",
		invalid: "The file {{value}} is not valid!",
	},
];

/**
 * Find the root form block.
 *
 * @param {string} clientId The id of the block of which we are finding the root
 * @param {string} asRoot Whether to use the given clientId as the root of the search.
 */
export function getRootFormBlock(clientId, asRoot = false) {
	//this functions will return the root form through which the given field is nested
	//excepting all of the cases;
	const rootId = asRoot ? clientId : getBlockHierarchyRootClientId(clientId);
	const rootBlock = getBlock(rootId); //getting the root block;

	if (isEmpty(rootBlock)) return {}; // null exception

	//checking if the root block is "cwp/gutenberg-forms" or it is nested inside of this root block
	// for example "cwp/cover" can furthur nest our "cwp/gutenberg-forms" block

	if (rootBlock.name === "cwp/block-gutenberg-forms") {
		// if this condition is satisfied then our form is not nested inside
		// any other block, so we can simply return the root form

		return rootBlock;
	}

	// The  above condition didn't succeed, so our form block is nested somewhere
	// so we need to find our root form inside this block

	let rootForm;

	for (const childBlock of rootBlock.innerBlocks) {
		// our root form block is nested somewhere here...

		if (childBlock.name === "cwp/block-gutenberg-forms") {
			// if this condition is satisfied, This should be our block...

			rootForm = childBlock;

			break;
		} else if (has(childBlock, "innerBlocks")) {
			// Try to find the form block within this child. Make sure it's treated as the search root.
			let nestedSearch = getRootFormBlock(childBlock.clientId, true);

			if (!isEmpty(nestedSearch)) {
				rootForm = nestedSearch;
			}
		}
	}

	return rootForm;
}

function isDefaultValues(blockAttrs, type, fName, messages) {
	//ensuring that the block values aren't changed!

	if (!has(blockAttrs, "messages")) return;

	let defaultMessage = messages.find((v) => v.fieldName === fName);

	let statics = defaultFieldMessages.find((v) => v.fieldName === fName);

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

	block.innerBlocks.forEach((b) => {
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
	const rootBlock = getRootFormBlock(clientId);
	const currentBlock = getBlock(clientId);

	if (rootBlock.name !== "cwp/block-gutenberg-forms" || isEmpty(currentBlock))
		return [{}];

	let { messages } = rootBlock.attributes;

	const rootMessage = messages.find((v) => v.fieldName === blockName);
	const defaultMessage = defaultFieldMessages.find((field) =>
		isEqual(field.fieldName, blockName)
	);

	const currentMessages = get(currentBlock, "attributes.messages");

	const messages_not_changed = isEqual(
		omit(currentMessages, ["fieldName"]),
		omit(defaultMessage, ["fieldName"])
	);

	if (messages_not_changed) {
		return rootMessage;
	} else {
		return currentMessages;
	}
}

export function getChildAttributes(clientId) {
	const rootBlock = getBlock(clientId); //i.e = gutenberg-forms;
	let childAttrs = [];

	if (!has(rootBlock, "innerBlocks")) return childAttrs;

	rootBlock.innerBlocks.forEach((v) => {
		if (layoutBlocks.includes(v.name)) {
			//which means field are nested even more!
			childAttrs.push(...getChildAttributes(v.clientId));
		} else if (has(v, "attributes")) {
			childAttrs.push(v["attributes"]);
		}
	});

	return childAttrs;
}

export function getSiblings(clientId, slug = null) {
	const rootBlock = getRootFormBlock(clientId); //i.e = gutenberg-forms;

	if (isEmpty(rootBlock)) return []; //null exception

	if (
		rootBlock.name !== "cwp/block-gutenberg-forms" &&
		has(rootBlock, "innerBlocks")
	)
		return false;

	let siblingValues = [];

	rootBlock.innerBlocks.forEach((v) => {
		const breaked = v.name.split("/");

		const conditions = {
			isCakewpBlock: v.name.startsWith("cwp/"), //ensuring that this is our block!
			isFieldBlock: myAttrs.includes(breaked[breaked.length - 1]), //ensuring that it is a gutenberg-form field;
			isLayoutBlock: layoutBlocks.includes(v.name), //ensuring that it is not a layout block
			currentBlock: v.clientId === clientId, //ensuring that this is not the block
			miscBlocks: miscBlocks.includes(v.name),
		};

		if (
			conditions.isCakewpBlock &&
			conditions.isFieldBlock &&
			!conditions.isLayoutBlock &&
			!conditions.currentBlock &&
			!conditions.miscBlock
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

	childs.forEach((child) => {
		if (child.isRequired) {
			res = true;
		}
	});

	return res;
}

export function detectSimilarFields(clientId, field_id) {
	//this will detect the similar id across fields

	const root = getBlock(getBlockRootClientId(clientId));
	let result = false;

	if (!has(root, "innerBlocks")) return;

	root.innerBlocks.forEach((block) => {
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

export function getFormTemplates(type) {
	const commonTemplate = [
		["cwp/name", {}],
		["cwp/email", {}],
		["cwp/message", {}],
	];

	if (type === "standard") {
		return commonTemplate;
	}

	if (type === "multiStep") {
		return [
			[
				"cwp/form-step",
				{},
				[
					["cwp/name", {}],
					["cwp/form-button", { action: "next", label: "Next" }],
				],
			],
			[
				"cwp/form-step",
				{},
				[
					["cwp/email", {}],
					["cwp/form-button", { action: "previous", label: "Previous" }],
				],
			],
		];
	}
}

export function detect_similar_forms(clientId) {
	//? test if the form is duplicated and has the same form id as the above form

	let currentBlock = getBlock(clientId);
	let previousBlock = getBlock(getPreviousBlockClientId(clientId));

	// getting the previous block because when user duplicate a block it is appended after, Therefore this is the duplicated block

	if (
		!isEmpty(previousBlock) &&
		get(previousBlock, "name") === get(currentBlock, "name")
	) {
		// checking if the previousBlock is not empty and it is our form block

		let form_id_prev = get(previousBlock, "attributes.id");

		let current_form_id = get(currentBlock, "attributes.id");

		if (isEqual(form_id_prev, current_form_id)) {
			return true;
		}
	}

	return false;
}

export function get_form_actions() {
	const actions = ["Record Entries", "Email Notification"];

	each(cwpGlobal.settings.integrations, (integration, key) => {
		if (integration.enable && integration.type === "autoResponder") {
			actions.push(integration.title);
		}
	});

	return actions;
}

export function get_spam_protectors() {
	const protectors = [];

	each(cwpGlobal.settings.integrations, (integration, key) => {
		if (integration.enable && integration.type === "spamProtection") {
			protectors.push({
				title: integration.title,
				fields: integration.fields,
			});
		}
	});

	return protectors;
}

export function hasObject(array, object) {
	let res = false;

	array.forEach((i) => {
		if (isEqual(i, object)) {
			res = true;
		}
	});

	return res;
}

export function hasProtection(name, pr) {
	let res = false;

	pr.forEach((protection) => {
		if (isEqual(protection.title, name)) {
			res = true;
		}
	});

	return res;
}

export function getProtection(name, pr) {
	let res;

	pr.forEach((protection) => {
		if (isEqual(protection.title, name)) {
			res = protection;
		}
	});

	return res;
}

export function getGlobalMessages() {
	const globalMessages = cwpGlobal.generalSettings.messages;
	const defaultValidationMessages = defaultFieldMessages.map((v) => {
		if (has(v, "invalid")) {
			return {
				...v,
				invalid: globalMessages[v.fieldName]["value"],
			};
		}

		if (has(v, "invalidName")) {
			return {
				...v,
				invalidName: globalMessages[v.fieldName]["value"],
			};
		}

		if (has(v, "invalidEmail")) {
			return {
				...v,
				invalidEmail: globalMessages[v.fieldName]["value"],
			};
		}

		return v;
	});

	return defaultValidationMessages;
}

// will get post url from the post id from the cwpGlobal variable

export function getPostUrl(id) {
	const posts = get(window, "cwpGlobal.cwp-cpt-forms");
	const filteredPost = isArray(posts)
		? posts.filter((post) => isEqual(toString(post.ID), id))
		: false;

	const requiredPost = isArray(filteredPost) ? filteredPost[0] : false;

	if (!requiredPost) {
		return "";
	} else {
		const url = get(requiredPost, "post_edit_url");
		const editUrl = url.concat("&action=edit");
		return editUrl;
	}
}

export function getFieldsTags(clientId, root = false) {
	const rootBlock = root ? getBlock(clientId) : getRootFormBlock(clientId);
	const child_fields = get(rootBlock, "innerBlocks");

	const fields = serializeFields(child_fields, clientId);

	return fields;
}

export function getMetaTags() {
	let meta = getEditedPostAttribute("meta");
	let metaTags = [];

	each(meta, (_, key) => {
		const tag = {
			title: key,
			tag: `{{post_meta:${key}}}`,
		};

		metaTags.push(tag);
	});

	return metaTags;
}

export function getWordpressTags() {
	const tags = [
		{
			title: "Post ID",
			tag: `{{wp:post_id}}`, // done
		},
		{
			title: "Post Title",
			tag: `{{wp:post_title}}`, // done
		},
		{
			title: "Post URL",
			tag: `{{wp:post_url}}`, // done
		},
		{
			title: "Post Author",
			tag: `{{wp:post_author}}`, // done
		},
		{
			title: "Post Author Email",
			tag: `{{wp:post_author_email}}`, // done
		},
		// {
		// 	title: "Post Meta",
		// 	tag: `{{post_meta:YOUR_META_KEY}}`, // later
		// },
		{
			title: "User ID",
			tag: `{{wp:user_id}}`, // done
		},
		{
			title: "User First Name",
			tag: `{{wp:user_first_name}}`, // done
		},
		{
			title: "User Last Name",
			tag: `{{wp:user_last_name}}`, // done
		},
		{
			title: "User Display Name",
			tag: `{{wp:user_display_name}}`, // done
		},
		{
			title: "User Username",
			tag: `{{wp:user_username}}`, // done
		},
		{
			title: "User Email",
			tag: `{{wp:user_email}}`, // done
		},
		{
			title: "User URL",
			tag: `{{wp:user_url}}`, // done
		},
		{
			title: "Site Title",
			tag: `{{wp:site_title}}`, // done
		},
		{
			title: "Site URL",
			tag: `{{wp:site_url}}`, // done
		},
		{
			title: "Admin Email",
			tag: `{{wp:admin_email}}`, // done
		},
	];

	return tags;
}

export function getFormTags() {
	const tags = [
		{
			title: "Form ID",
			tag: `{{form:form_id}}`, // done
		},
		{
			title: "Form Label",
			tag: `{{form:form_label}}`, // done
		},
	];

	return tags;
}

export function getOtherTags() {
	const tags = [
		{
			title: "Date",
			tag: `{{other:date}}`, // done
		},
		{
			title: "Time",
			tag: `{{other:time}}`, // done
		},
	];

	return tags;
}
