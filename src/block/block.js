import "./editor.scss";
import "./style.scss";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

////////////////////////////////!MAIN!//////////////////////////////////////////////

import mainEdit from "./edit";
import mainSave from "./save";

////////////////////////////////!MAIN!//////////////////////////////////////////////

////////////////////////////////!name!//////////////////////////////////////////////

import nameEdit from "../Form Childs/name/edit";
import nameSave from "../Form Childs/name/save";

////////////////////////////////!name!//////////////////////////////////////////////

////////////////////////////////!message!//////////////////////////////////////////////

import messageEdit from "../Form Childs/message/edit";
import messageSave from "../Form Childs/message/save";

////////////////////////////////!message!//////////////////////////////////////////////

////////////////////////////////!radio!//////////////////////////////////////////////

import radioEdit from "../Form Childs/radio/edit";
import radioSave from "../Form Childs/radio/save";

////////////////////////////////!radio!//////////////////////////////////////////////

////////////////////////////////!phone!//////////////////////////////////////////////

import phoneEdit from "../Form Childs/phone/edit";
import phoneSave from "../Form Childs/phone/save";

////////////////////////////////!phone!//////////////////////////////////////////////

////////////////////////////////!website!//////////////////////////////////////////////

import websiteEdit from "../Form Childs/website/edit";
import websiteSave from "../Form Childs/website/save";

////////////////////////////////!website!//////////////////////////////////////////////

////////////////////////////////!text!//////////////////////////////////////////////

import textEdit from "../Form Childs/text/edit";
import textSave from "../Form Childs/text/save";

////////////////////////////////!text!//////////////////////////////////////////////

////////////////////////////////!text!//////////////////////////////////////////////

import selectEdit from "../Form Childs/select/edit";
import selectSave from "../Form Childs/select/save";

////////////////////////////////!text!//////////////////////////////////////////////

////////////////////////////////!formColumn!//////////////////////////////////////////////

import formColumnEdit from "../Form Childs/form-column/edit";
import formColumnSave from "../Form Childs/form-column/save";

////////////////////////////////!formColumn!//////////////////////////////////////////////

////////////////////////////////!Column!//////////////////////////////////////////////

import columnEdit from "../Form Childs/form-column/child/column/edit";
import columnSave from "../Form Childs/form-column/child/column/save";

// ^^ Child block for the form-column block for creating layouts;

////////////////////////////////!Column!//////////////////////////////////////////////

////////////////////////////////!Number!//////////////////////////////////////////////

import numberEdit from "../Form Childs/number/edit";
import numberSave from "../Form Childs/number/save";

////////////////////////////////!Number!//////////////////////////////////////////////

////////////////////////////////!yesNo!//////////////////////////////////////////////

import yesNoEdit from "../Form Childs/yes & no/edit";
import yesNoSave from "../Form Childs/yes & no/save";

////////////////////////////////!yesNo!//////////////////////////////////////////////

import { applyFormStyles } from "./formStyles/index";
import { registerFieldStyles } from "./fieldStyles/index";
import { getFieldTransform, defaultFieldMessages } from "./functions/index";

//for sanitizing the label

const fieldParents = [
		"cwp/block-gutenberg-forms",
		"cwp/column",
		"cwp/form-group"
	],
	fieldSupport = {
		align: true,
		align: ["wide", "full", "center"]
	};

registerBlockType("cwp/block-gutenberg-forms", {
	supports: fieldSupport,
	title: __("Gutenberg Forms"),
	icon: __("feedback"),
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms")],
	attributes: {
		submitLabel: {
			type: "string",
			default: "Submit"
		},
		buttonSetting: {
			type: "object",
			default: {
				disable: false,
				alignment: "justify-start"
			}
		},
		id: {
			type: "string",
			default: ""
		},
		templateBuilder: {
			type: "boolean",
			default: false
		},
		template: {
			type: "string",
			default: JSON.stringify({
				subject: "",
				body: ""
			})
		},
		email: {
			type: "string",
			default: ""
		},
		fromEmail: {
			type: "string",
			default: ""
		},
		successURL: {
			type: "string",
			default: ""
		},
		successType: {
			type: "string",
			default: "message"
		},
		successMessage: {
			type: "string",
			default: "The form has been submitted Successfully!"
		},
		recaptcha: {
			type: "object",
			default: {
				enable: false,
				siteKey: "",
				clientSecret: ""
			}
		},
		messages: {
			type: "array",
			default: defaultFieldMessages
		},
		theme: {
			type: "object",
			default: {
				accentColor: "",
				textColor: "",
				fieldBackgroundColor: ""
			}
		}
	},
	edit: mainEdit,
	save: mainSave
});

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
	"number",
	"yes-no"
];

applyFormStyles("cwp/block-gutenberg-forms"); //registering styles
registerFieldStyles(myAttrs); //registering field styles

registerBlockType("cwp/name", {
	title: __("Name"),
	icon: "admin-users",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("name")],
	edit: nameEdit,
	save: nameSave,
	attributes: {
		enableCondition: {
			type: "boolean",
			default: false
		},
		name: {
			type: "string",
			default: ""
		},
		isRequired: {
			type: "boolean",
			default: false
		},
		label: {
			type: "string",
			default: "Name"
		},
		id: {
			type: "string",
			default: ""
		},
		field_name: {
			type: "string",
			default: ""
		},
		messages: {
			type: "object",
			default: {
				empty: "Please fill out this field!",
				invalidName: "The name {{value}} is not valid!"
			}
		},
		pattern: {
			type: "string",
			default: ""
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
		}
	},
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map(block => "cwp/".concat(block)),
				transform: a => getFieldTransform(a, "name")
			}
		]
	},
	parent: fieldParents
});

registerBlockType("cwp/text", {
	title: __("Text"),
	icon: "text",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("text")],
	edit: textEdit,
	save: textSave,
	attributes: {
		enableCondition: {
			type: "boolean",
			default: false
		},
		text: {
			type: "string",
			default: ""
		},
		isRequired: {
			type: "boolean",
			default: false
		},
		label: {
			type: "string",
			default: "Text"
		},
		id: {
			type: "string",
			default: ""
		},
		field_name: {
			type: "string",
			default: ""
		},
		messages: {
			type: "object",
			default: {
				empty: "Please fill out this field!",
				invalid: "The text {{value}} is not valid!"
			}
		},
		pattern: {
			type: "string",
			default: ""
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
		}
	},
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map(block => "cwp/".concat(block)),
				transform: a => getFieldTransform(a, "text")
			}
		]
	},
	parent: fieldParents
});

registerBlockType("cwp/message", {
	title: __("Message"),
	icon: "testimonial",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("message")],
	edit: messageEdit,
	save: messageSave,
	attributes: {
		enableCondition: {
			type: "boolean",
			default: false
		},
		message: {
			type: "string",
			default: ""
		},
		isRequired: {
			type: "boolean",
			default: false
		},
		label: {
			type: "string",
			default: "Message"
		},
		id: {
			type: "string",
			default: ""
		},
		height: {
			type: "number",
			default: 200
		},
		field_name: {
			type: "string",
			default: ""
		},
		messages: {
			type: "object",
			default: {
				empty: "Please fill out this field!",
				invalid: "The message {{value}} is not valid!"
			}
		},
		pattern: {
			type: "string",
			default: ""
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
		}
	},
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map(block => "cwp/".concat(block)),
				transform: a => getFieldTransform(a, "message")
			}
		]
	},
	parent: fieldParents
});

registerBlockType("cwp/radio", {
	title: __("Radio"),
	icon: "marker",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("radio")],
	edit: radioEdit,
	save: radioSave,
	attributes: {
		enableCondition: {
			type: "boolean",
			default: false
		},
		isRequired: {
			type: "boolean",
			default: false
		},
		options: {
			type: "array",
			default: [
				{
					label: "Option 1"
				},
				{
					label: "Option 2"
				}
			]
		},
		label: {
			type: "string",
			default: "Choose One"
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
				empty: "Please select radio!"
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
		fieldStyle: {
			type: "string",
			default: "block"
		}
	},
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map(block => "cwp/".concat(block)),
				transform: a => getFieldTransform(a, "radio")
			}
		]
	},
	parent: fieldParents
});

registerBlockType("cwp/phone", {
	title: __("Phone"),
	icon: "phone",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("phone")],
	edit: phoneEdit,
	save: phoneSave,
	attributes: {
		enableCondition: {
			type: "boolean",
			default: false
		},
		phone: {
			type: "string",
			default: ""
		},
		isRequired: {
			type: "boolean",
			default: false
		},
		label: {
			type: "string",
			default: "Phone No:"
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
				invalid: "The phone {{value}} is not valid!"
			}
		},
		pattern: {
			type: "string",
			default: "[\\+\\d\\d\\d\\d\\d\\d\\d\\d\\d\\d\\d]+"
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
		}
	},
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map(block => "cwp/".concat(block)),
				transform: a => getFieldTransform(a, "phone")
			}
		]
	},
	parent: fieldParents
});

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

registerBlockType("cwp/select", {
	title: __("Select"),
	icon: "menu-alt",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("select")],
	edit: selectEdit,
	save: selectSave,
	attributes: {
		isRequired: {
			type: "boolean",
			default: false
		},
		options: {
			type: "array",
			default: [
				{
					label: "Option 1"
				},
				{
					label: "Option 2"
				}
			]
		},
		label: {
			type: "string",
			default: "Choose One"
		},
		id: {
			type: "string",
			default: ""
		},
		enableCondition: {
			type: "boolean",
			default: false
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
				empty: "Please select option!"
			}
		},
		condition: {
			type: "object",
			default: {
				field: null,
				condition: "===",
				value: ""
			}
		}
	},
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map(block => "cwp/".concat(block)),
				transform: a => getFieldTransform(a, "select")
			}
		]
	},
	parent: fieldParents
});

registerBlockType("cwp/form-column", {
	title: __("Form Column"),
	icon: "editor-table",
	category: "common",
	keywords: [
		__("gutenberg-forms"),
		__("forms"),
		__("form-column"),
		__("column")
	],
	edit: formColumnEdit,
	save: formColumnSave,
	attributes: {
		columns: {
			type: "number",
			default: 3
		},
		intro: {
			type: "boolean",
			default: false
		},
		stack: {
			type: "boolean",
			default: true
		}
	},
	supports: {
		align: true,
		align: ["wide", "full", "center"]
	},
	parent: fieldParents
});

registerBlockType("cwp/column", {
	title: __("Column"),
	icon: "editor-table",
	category: "common",
	keywords: [
		__("gutenberg-forms"),
		__("forms"),
		__("form-column"),
		__("column")
	],
	edit: columnEdit,
	save: columnSave,
	attributes: {},
	parent: ["cwp/form-column"]
});

registerBlockType("cwp/number", {
	title: __("Number"),
	icon: "screenoptions",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("number")],
	edit: numberEdit,
	save: numberSave,
	attributes: {
		enableCondition: {
			type: "boolean",
			default: false
		},
		number: {
			type: "string",
			default: ""
		},
		isRequired: {
			type: "boolean",
			default: false
		},
		label: {
			type: "string",
			default: "Enter Number:"
		},
		id: {
			type: "string",
			default: ""
		},
		field_name: {
			type: "string",
			default: ""
		},
		isRange: {
			type: "boolean",
			default: false
		},
		steps: {
			type: "number",
			default: 1
		},
		rangeMax: {
			type: "number",
			default: 100
		},
		rangeMin: {
			type: "number",
			default: 0
		},
		requiredLabel: {
			type: "string",
			default: "*"
		},
		errorValidityText: {
			type: "string",
			default: "Please fill out this field!"
		},
		condition: {
			type: "object",
			default: {
				field: null,
				condition: "===",
				value: ""
			}
		},
		messages: {
			type: "object",
			default: {
				empty: "Please fill out this field!",
				invalid: "The number {{value}} is not in range!"
			}
		}
	},
	transforms: {
		from: [
			{
				type: "block",
				blocks: myAttrs.map(block => "cwp/".concat(block)),
				transform: a => getFieldTransform(a, "number")
			}
		]
	},
	parent: fieldParents
});

registerBlockType("cwp/yes-no", {
	title: __("Yes / No"),
	icon: "no",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("yes-no")],
	edit: yesNoEdit,
	save: yesNoSave,
	attributes: {
		yes_no: {
			type: "boolean",
			defaut: false
		},
		requiredLabel: {
			type: "string",
			default: "*"
		},
		isRequired: {
			type: "boolean",
			default: false
		},
		label: {
			type: "string",
			default: "Yes Or No?"
		},
		id: {
			type: "string",
			default: ""
		},
		field_name: {
			type: "string",
			default: ""
		},
		errorValidityText: {
			type: "string",
			default: "Please fill out this field!"
		},
		enableCondition: {
			type: "boolean",
			default: false
		},
		condition: {
			type: "object",
			default: {
				field: null,
				condition: "===",
				value: ""
			}
		}
	},
	parent: fieldParents
});
