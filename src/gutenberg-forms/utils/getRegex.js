export default function getRegex(fields) {
	let res = [];

	fields.forEach((f, i) => {
		if (i !== fields.length - 1) {
			res += `{{${f}}}|`;
		} else if (i === fields.length - 1) {
			res += `{{${f}}}`;
		}
	});

	return new RegExp(res, "g");
}
