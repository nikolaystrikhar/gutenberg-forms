export function getFieldName(field, id) {
	let shorten_id = id.substring(0, 6);

	return field + "-" + shorten_id;
}
