import { strip_tags } from "../misc/helper";
const { createBlock } = wp.blocks;

const radio_enabled_fields = ["select", "radio", "checkbox"]; //fields that support multiple

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
