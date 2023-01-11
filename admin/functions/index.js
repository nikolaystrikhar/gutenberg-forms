import { SETTINGS_SAVING, SETTINGS_SAVED } from '../redux/actions/types';
import { __ } from '@wordpress/i18n';

export function parseSettingStatus(status) {
	switch (status) {
		case SETTINGS_SAVING:
			return __('Saving', 'forms-gutenberg');

		case SETTINGS_SAVED:
			return __('Saved', 'forms-gutenberg');
	}
}

export function parse_guide(html) {
	let breaker = '<!--Guide Break-->';
	const pages = html.split(breaker);

	return pages;
}

export function makeid(length) {
	var result = '';
	var characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength)
		);
	}
	return result;
}

/**
 * Will convert object into query string
 * @param {object} params the query object
 * @return {string} query string
 */
export function httpQuery(params) {
	const qs = Object.keys(params)
		.map((key) => `${key}=${params[key]}`)
		.join('&');
	return qs;
}

/**
 * Will return the array count to a certain range
 * @param {number} range
 * @return {array}
 */
export function createArrayToNum(range) {
	let requiredArray = [];

	for (let i = 0; i <= range; ++i) {
		requiredArray.push(i);
	}

	return requiredArray;
}
