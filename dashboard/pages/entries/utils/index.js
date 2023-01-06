import { each, get, map, isEmpty, has, assign } from 'lodash';

/**
 * Will take date from the rest entries controller of bar chart and
 * will format it as per chart requires
 *
 * @param {object} fetched_data - bar chart data
 * @return {array} parsed data
 */

export function parse_bar_chart_data(fetched_data) {
	const parsed_data = [];
	const data = get(fetched_data, 'data');

	each(data, (value, key) => {
		const data_to_push = {
			date: get(value, 'date'),
		};

		const total_forms = get(value, 'total_forms');

		each(total_forms, (form) => {
			const label = get(form, 'label');
			const total_submission = get(form, 'total_submissions');
			data_to_push[label] = total_submission;
		});

		parsed_data.push(data_to_push);
	});

	return parsed_data;
}

/**
 *
 * @param {string} hash current page hash
 *
 */

export function parse_entry_id(hash) {
	const hashBraces = hash.split('/');
	const entryId = get(hashBraces, hashBraces.length - 1);

	return isNaN(Number(entryId)) ? null : ~~entryId;
}

/**
 *
 * @param {string} hash current page hash
 *
 */

export function parse_entry_slug(hash) {
	const hashBraces = hash.split('/');
	const entrySlugWithPost = get(hashBraces, hashBraces.length - 1);
	const entrySlug = get(entrySlugWithPost.split('='), 1);

	return entrySlug;
}

/**
 * @param {string} hash current page hash
 */

export function extractFormId(hash) {
	const hashBraces = hash.split('/');
	const form_id = hashBraces.filter((p) => p.startsWith('form-'));

	return get(form_id, 0);
}

/**
 *  Will find urls in plain string and convert them into string
 * @param {string} inputText
 * @return {string} result
 */

export function linkify(inputText, showPreview = false) {
	var replacedText, replacePattern1, replacePattern2, replacePattern3;

	//URLs starting with http://, https://, or ftp://
	replacePattern1 =
		/(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
	replacedText = inputText.replace(
		replacePattern1,
		`<a class="cwp-linkified" href="$1" target="_blank">
      $1
    </a>`
	);

	//URLs starting with "www." (without // before it, or it'd re-link the ones done above).
	replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
	replacedText = replacedText.replace(
		replacePattern2,
		`$1<a class="cwp-linkified" href="http://$2" target="_blank">$2 </a>`
	);

	//Change email addresses to mailto:: links.
	replacePattern3 =
		/(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
	replacedText = replacedText.replace(
		replacePattern3,
		'<a href="mailto:$1">$1</a>'
	);

	return replacedText;
}

/**
 * Will return all the available field name of the given form data
 * @param {array} data Data from the rest api response
 * @param {object} allowedCols The result will be generated of the column if it's set to true
 */

export function extract_fields(data, allowedCols = {}) {
	const fields = map(data, 'entry_fields');
	const fields_keys = map(fields, (v) => Object.keys(v));
	let keys = [];

	fields_keys.forEach((fields) => {
		fields.forEach((field) => {
			const isAllowed = isEmpty(allowedCols)
				? true
				: get(allowedCols, field);

			if (!keys.includes(field) && isAllowed) {
				keys.push(field);
			}
		});
	});

	return keys; // all the field ids
}

/**
 * Will return the form detail which filtered
 * @param {array} data Data from the rest api response
 * @param {string} type key of the required value
 */

export function extract_form_details(data, type) {
	const extra_meta = map(data, 'entry_extra');
	const first_extra = get(extra_meta, 0);
	const form_label = get(first_extra, type);
	return form_label;
}

/**
 * Will truncate the given text
 * @param {string} text the text that will be truncated
 * @param {number} length after this length the remaining text will be truncated
 */

export function truncateText(text, length) {
	if (text.length < length) return text;

	return text.substring(0, length).concat('...');
}

function order_object(object, keys = []) {
	const ordered_object = {};

	keys.forEach((v) => {
		ordered_object[v] = get(object, v);
	});

	return ordered_object;
}

/**
 * Will return same entry with all available fields
 * @param {object} fields entry-fields
 * @param {array} data response data
 * @param {object} allowedCols The result will be generated of the column if it's set to true
 */

export function match_entry_fields(data, fields, allowedCols = {}) {
	const extracted_fields = extract_fields(data, allowedCols);
	const matched_fields = {};

	each(fields, (field, field_name) => {
		matched_fields[field_name] = field;
	});

	each(extracted_fields, (extracted_field) => {
		if (!has(matched_fields, extracted_field)) {
			matched_fields[extracted_field] = '-';
		}
	});

	return order_object(matched_fields, extracted_fields);
}
