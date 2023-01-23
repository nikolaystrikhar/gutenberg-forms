export default function getMapObject(fields, data) {
	let res = {};

	fields.forEach((f) => {
		let breaked = f.split("-");

		let fieldName;

		let firstLetter = breaked[1].substring(0, 1).toUpperCase();

		if (isNaN(firstLetter)) {
			fieldName =
				"number" +
				breaked[1].substring(0, 1).toUpperCase() +
				breaked[1].substring(1, breaked[1].length);
		} else {
			fieldName = f;
		}

		res["{{" + f + "}}"] = data[fieldName];
	});
	return res;
}
