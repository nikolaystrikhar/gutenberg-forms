import { SETTINGS_SAVING, SETTINGS_SAVED } from '../redux/actions/types';
import { has, isEmpty, get, each } from 'lodash';

export function parseSettingStatus(status) {
	switch (status) {
		case SETTINGS_SAVING:
			return 'Saving';

		case SETTINGS_SAVED:
			return 'Settings Saved';
	}
}

export function parse_guide(html) {
	let breaker = '<!--Guide Break-->';
	const pages = html.split(breaker);

	return pages;
}

export function test_props(object, props) {
	for (let i = 0; i < props.length; ++i) {
		if (!has(object, props[i])) {
			return false;
		}
	}

	for (let i = 0; i < props.length; ++i) {
		if (isEmpty(object[props[i]])) {
			return false;
		}
	}

	return true;
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
 * Will format the given date object into from now for example -  2 days ago
 * @param {Date} date
 */

export function timeSince(date) {
	if (typeof date !== 'object') {
		date = new Date(date);
	}

	var seconds = Math.floor((new Date() - date) / 1000);
	var intervalType;

	var interval = Math.floor(seconds / 31536000);
	if (interval >= 1) {
		intervalType = 'year';
	} else {
		interval = Math.floor(seconds / 2592000);
		if (interval >= 1) {
			intervalType = 'month';
		} else {
			interval = Math.floor(seconds / 86400);
			if (interval >= 1) {
				intervalType = 'day';
			} else {
				interval = Math.floor(seconds / 3600);
				if (interval >= 1) {
					intervalType = 'hour';
				} else {
					interval = Math.floor(seconds / 60);
					if (interval >= 1) {
						intervalType = 'minute';
					} else {
						interval = seconds;
						intervalType = 'second';
					}
				}
			}
		}
	}

	if (interval > 1 || interval === 0) {
		intervalType += 's';
	}

	return interval + ' ' + intervalType + ' ago';
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
