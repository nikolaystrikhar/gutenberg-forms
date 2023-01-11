import { __ } from '@wordpress/i18n';
import { isEmpty, isEqual, isArray } from "lodash";
const { getBlock } = wp.data.select("core/block-editor");

export function getFieldName(field, id) {
	let shorten_id = id.substring(0, 6);

	return field + "-" + shorten_id;
}

export function extract_id(id) {
	let exploded = id.split("-");

	return exploded[exploded.length - 1];
}

export function extract_admin_id(id, type) {
	let exploded = extract_id(id);

	let admin_id = type + "_" + exploded;
	return admin_id;
}

export function getEncodedData(f, id, isRequired, adminId, extra = null) {
	if (extra === null) {
		return encodeURIComponent(
			window.btoa(`--${getFieldName(f, id)}-${isRequired}-${f}-${adminId}`)
		);
	} else {
		return encodeURIComponent(
			window.btoa(
				`--${getFieldName(f, id)}-${isRequired}-${f}-${adminId}-${extra}`
			)
		);
	}
}

export function get_admin_id(adminId) {
	if (isEmpty(adminId.value)) {
		return adminId.default;
	} else {
		return adminId.value;
	}
}

export function getFieldIcon(name) {
	const field = name.split("/")[name.split("/").length - 1];

	switch (field) {
		case "email":
			return "email";
		case "name":
			return "admin-users";
		case "message":
			return "testimonial";
		case "checkbox":
			return "yes";
		case "datepicker":
			return "calendar-alt";
		case "radio":
			return "marker";
		case "phone":
			return "phone";
		case "website":
			return "laptop";
		case "text":
			return "text";
		case "select":
			return "menu-alt";
		case "number":
			return "screenoptions";
		case "yes-no":
			return "no";
		case "form-calculation":
			return "media-document";
		case "file-upload":
			return "media-document";
		case "hidden":
			return "hidden";
		default:
			return;
	}
}

const layoutBlocks = [
	"cwp/form-column",
	"cwp/column",
	"cwp/form-group",
	"cwp/form-step",
]; //blocks that will be ignored while serializing...
const misc_blocks = ["cwp/form-button", "cwp/file-upload"];

export function serializeFields(fields, omitClientId = "") {
	let f = [];

	if (!isArray(fields)) return [];

	fields.forEach((field) => {
		if (
			field.name.startsWith("cwp/") &&
			!layoutBlocks.includes(field.name) &&
			!isEqual(omitClientId, field.clientId)
		) {
			if (!misc_blocks.includes(field.name)) {
				f.push({
					blockName: field.name,
					fieldName: field.attributes.label,
					field_id: field.attributes.field_name,
					adminId: field.attributes.adminId,
				});
			}
		} else if (layoutBlocks.includes(field.name)) {
			f.push(...serializeFields(field.innerBlocks));
		}
	});

	return f;
}

export function strip_tags(str) {
	let withoutTags = str.replace(/<[^>]*>?/gm, "");

	return withoutTags;
}

export const basicColorScheme = [
	{
		color: "rgb(247, 141, 167)",
		name: __("Pale Pink", "forms-gutenberg"),
	},
	{
		name: __("Vivid red", "forms-gutenberg"),
		color: "rgb(207, 46, 46)",
	},
	{
		name: __("Luminous vivid orange", "forms-gutenberg"),
		color: "rgb(255, 105, 0)",
	},
	{
		color: "rgb(252, 185, 0)",
		name: __("Luminous vivid amber", "forms-gutenberg"),
	},
	{
		color: "rgb(123, 220, 181)",
		name: __("Light green cyan", "forms-gutenberg"),
	},
	{
		color: "rgb(0, 208, 132)",
		name: __("Vivid green cyan", "forms-gutenberg"),
	},
	{
		color: "rgb(142, 209, 252)",
		name: __("Pale cyan blue", "forms-gutenberg"),
	},
	{
		color: "rgb(6, 147, 227)",
		name: __("Vivid cyan blue", "forms-gutenberg"),
	},
	{
		color: "rgb(155, 81, 224)",
		name: __("Vivid purple", "forms-gutenberg"),
	},
	{
		color: "rgb(238, 238, 238)",
		name: __("Very light gray", "forms-gutenberg"),
	},
	{
		color: "rgb(171, 184, 195)",
		name: __("Cyan bluish gray", "forms-gutenberg"),
	},
	{
		color: "rgb(49, 49, 49)",
		name: __("Very dark gray", "forms-gutenberg"),
	},
];

export const firstCapital = (str) => {
	let c = str.substring(0, 1).toUpperCase();

	return c.concat(str.substring(1, str.length));
};

export function getThemeStyling(theme, id) {
	const { accentColor, textColor, fieldBackgroundColor } = theme;

	return `<style>

		${
			!isEmpty(fieldBackgroundColor)
				? `#${id}.cwp-form .cwp-field.cwp-yes-no .cwp-field-set .cwp-switch input:checked + .cwp-slider {
			background-color: ${fieldBackgroundColor} !important;
		}`
				: ``
		}


		${
			!isEmpty(textColor)
				? `#${id}.cwp-form .cwp-field label {
				color: ${textColor} !important;
			}
			#${id}.cwp-form .cwp-field .rich-text {
				color: ${textColor} !important;
			}
			`
				: ``
		}

		${
			!isEmpty(accentColor)
				? `
			#${id}.cwp-form .cwp-default-submit-btn {
				color: ${accentColor} !important;
				border: 1px solid ${accentColor};
			}
		`
				: ``
		}

		#${id}.cwp-form .cwp-field.cwp-number .cwp-field-set .cwp-range-set input[type="range"] {
			border:none !important;
		}


		${
			!isEmpty(fieldBackgroundColor) ||
			!isEmpty(textColor) ||
			!isEmpty(accentColor)
				? `#${id}.cwp-form .cwp-field [data-cwp-field],
			#${id}.cwp-form .cwp-field .cwp-field-set input,
			#${id}.cwp-form .cwp-field .cwp-field-set textarea
			  {

				border: 1px solid ${accentColor};
				background-color: ${fieldBackgroundColor} !important;
				color: ${textColor} !important;

			}

				${
					!isEmpty(accentColor)
						? `

					#${id}.cwp-form .cwp-field .cwp-field-set .cwp-prefix,
					#${id}.cwp-form .cwp-field .cwp-field-set .cwp-suffix {
						border: 1px solid ${accentColor};
					}

				`
						: ``
				}

				${
					!isEmpty(textColor)
						? `

							#${id}.cwp-form .cwp-field .cwp-field-set .cwp-prefix,
							#${id}.cwp-form .cwp-field .cwp-field-set .cwp-suffix {
								color: ${textColor} !important;
							}
			`
						: ``
				}



			#${id}.cwp-form .cwp-field.is-style-button .cwp-checkbox-set input[type="checkbox"]:checked + label,
			#${id}.cwp-form .cwp-field.is-style-button .cwp-radio-set input[type="radio"]:checked + label,
			#${id}.cwp-form .cwp-field.is-style-button .cwp-radios-set input[type="radio"]:checked + label  {
				background-color: ${fieldBackgroundColor};
				color: ${accentColor} !important;
				border-color: 1px solid ${accentColor};
				z-index: 1;
			}
			`
				: ``
		}

		#${id}.cwp-form .cwp-field.is-style-button .cwp-checkbox-set input[type="checkbox"] + label,
		#${id}.cwp-form .cwp-field.is-style-button .cwp-radio-set input[type="radio"] + label,
		#${id}.cwp-form .cwp-field.is-style-button .cwp-radios-set input[type="radio"] + label {
			cursor: pointer;
			width: 100%;

		}



	</style>`;
}

export function getDeprecatedThemeStyling(theme, id) {
	const { accentColor, textColor, fieldBackgroundColor } = theme;

	return `<style>
		${
			!isEmpty(fieldBackgroundColor)
				? `#${id}.cwp-form .cwp-field.cwp-yes-no .cwp-field-set .cwp-switch input:checked + .cwp-slider {
			background-color: ${fieldBackgroundColor} !important;
		}`
				: ``
		}
		${
			!isEmpty(textColor)
				? `#${id}.cwp-form .cwp-field label {
				color: ${textColor} !important;
			}
			#${id}.cwp-form .cwp-field .rich-text {
				color: ${textColor} !important;
			}
			`
				: ``
		}
		${
			!isEmpty(accentColor)
				? `
			#${id}.cwp-form .cwp-default-submit-btn {
				color: ${accentColor} !important;
				border: 1px solid ${accentColor};
			}
		`
				: ``
		}
		#${id}.cwp-form .cwp-field.cwp-number .cwp-field-set .cwp-range-set input[type="range"] {
			border:none !important;
		}
		${
			!isEmpty(fieldBackgroundColor) ||
			!isEmpty(textColor) ||
			!isEmpty(accentColor)
				? `#${id}.cwp-form .cwp-field [data-cwp-field],
			#${id}.cwp-form .cwp-field .cwp-field-set input,
			#${id}.cwp-form .cwp-field .cwp-field-set textarea  {

				border: 1px solid ${accentColor};
				background-color: ${fieldBackgroundColor} !important;
				color: ${textColor} !important;

			}

			#${id}.cwp-form .cwp-field.is-style-button .cwp-checkbox-set input[type="checkbox"]:checked + label,
			#${id}.cwp-form .cwp-field.is-style-button .cwp-radio-set input[type="radio"]:checked + label,
			#${id}.cwp-form .cwp-field.is-style-button .cwp-radios-set input[type="radio"]:checked + label  {
				background-color: ${fieldBackgroundColor};
				color: ${accentColor} !important;
				border-color: 1px solid ${accentColor};
				z-index: 1;
			}
			`
				: ``
		}
		#${id}.cwp-form .cwp-field.is-style-button .cwp-checkbox-set input[type="checkbox"] + label,
		#${id}.cwp-form .cwp-field.is-style-button .cwp-radio-set input[type="radio"] + label,
		#${id}.cwp-form .cwp-field.is-style-button .cwp-radios-set input[type="radio"] + label {
			cursor: pointer;
			width: 100%;
		}

	</style>`;
}
