import "./editor.scss";
import "./style.scss";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

////////////////////////////////!MAIN!//////////////////////////////////////////////

import mainEdit from "./edit";
import mainSave from "./save";

////////////////////////////////!MAIN!//////////////////////////////////////////////

////////////////////////////////!email!//////////////////////////////////////////////

import emailEdit from "../Form Childs/email/edit";
import emailSave from "../Form Childs/email/save";

////////////////////////////////!email!//////////////////////////////////////////////

////////////////////////////////!name!//////////////////////////////////////////////

import nameEdit from "../Form Childs/name/edit";
import nameSave from "../Form Childs/name/save";

////////////////////////////////!name!//////////////////////////////////////////////

////////////////////////////////!message!//////////////////////////////////////////////

import messageEdit from "../Form Childs/message/edit";
import messageSave from "../Form Childs/message/save";

////////////////////////////////!message!//////////////////////////////////////////////

////////////////////////////////!checkbox!//////////////////////////////////////////////

import checkboxEdit from "../Form Childs/checkbox/edit";
import checkboxSave from "../Form Childs/checkbox/save";

////////////////////////////////!checkbox!//////////////////////////////////////////////

////////////////////////////////!datepicker!//////////////////////////////////////////////

import datePickerEdit from "../Form Childs/datePicker/edit";
import datePickerSave from "../Form Childs/datePicker/save";

////////////////////////////////!datepicker!//////////////////////////////////////////////

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

registerBlockType("cwp/block-gutenberg-forms", {
	align: true,
	align: ["left", "right", "full"],
	title: __("Gutenberg Forms"),
	icon: "shield",
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
				alignment: "justify-start"
			}
		}
	},
	edit: mainEdit,
	save: mainSave
});

registerBlockType("cwp/email", {
	title: __("Email"),
	icon: "email",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("mail")],
	edit: emailEdit,
	save: emailSave,
	attributes: {
		email: {
			type: "string",
			default: ""
		},
		isRequired: {
			type: "boolean",
			default: false
		},
		label: {
			type: "string",
			default: "Email"
		}
	},
	parent: ["cwp/block-gutenberg-forms"]
});

registerBlockType("cwp/name", {
	title: __("Name"),
	icon: "admin-users",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("name")],
	edit: nameEdit,
	save: nameSave,
	attributes: {
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
		}
	},
	parent: ["cwp/block-gutenberg-forms"]
});

registerBlockType("cwp/message", {
	title: __("Message"),
	icon: "testimonial",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("message")],
	edit: messageEdit,
	save: messageSave,
	attributes: {
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
		}
	},
	parent: ["cwp/block-gutenberg-forms"]
});

registerBlockType("cwp/checkbox", {
	title: __("checkbox"),
	icon: "yes",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("checkbox")],
	edit: checkboxEdit,
	save: checkboxSave,
	attributes: {
		isRequired: {
			type: "boolean",
			default: false
		},
		options: {
			type: "array",
			default: [
				{
					label: "Checkbox 1"
				},
				{
					label: "Checkbox 2"
				}
			]
		},
		label: {
			type: "string",
			default: "Choose One"
		}
	},
	parent: ["cwp/block-gutenberg-forms"]
});

registerBlockType("cwp/datepicker", {
	title: __("Date Picker"),
	icon: "calendar-alt",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("datepicker")],
	edit: datePickerEdit,
	save: datePickerSave,
	attributes: {
		isRequired: {
			type: "boolean",
			default: false
		},
		label: {
			type: "string",
			default: "Pick Date"
		},
		placeholder: {
			type: "string",
			default: ""
		}
	},
	parent: ["cwp/block-gutenberg-forms"]
});

registerBlockType("cwp/radio", {
	title: __("Radio"),
	icon: "marker",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("radio")],
	edit: radioEdit,
	save: radioSave,
	attributes: {
		isRequired: {
			type: "boolean",
			default: false
		},
		options: {
			type: "array",
			default: [
				{
					label: "Radio 1"
				},
				{
					label: "Radio 2"
				}
			]
		},
		label: {
			type: "string",
			default: "Choose One"
		}
	},
	parent: ["cwp/block-gutenberg-forms"]
});

registerBlockType("cwp/phone", {
	title: __("Phone"),
	icon: "phone",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("phone")],
	edit: phoneEdit,
	save: phoneSave,
	attributes: {
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
		}
	},
	parent: ["cwp/block-gutenberg-forms"]
});

registerBlockType("cwp/website", {
	title: __("Website"),
	icon: "laptop",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("website")],
	edit: websiteEdit,
	save: websiteSave,
	attributes: {
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
		}
	},
	parent: ["cwp/block-gutenberg-forms"]
});

registerBlockType("cwp/text", {
	title: __("Text"),
	icon: "text",
	category: "common",
	keywords: [__("gutenberg-forms"), __("forms"), __("text")],
	edit: textEdit,
	save: textSave,
	attributes: {
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
		}
	},
	parent: ["cwp/block-gutenberg-forms"]
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
					label: "Select 1"
				},
				{
					label: "Select 2"
				}
			]
		},
		label: {
			type: "string",
			default: "Choose One"
		}
	},
	parent: ["cwp/block-gutenberg-forms"]
});
