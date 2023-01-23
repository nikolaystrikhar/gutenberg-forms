import $ from 'jquery';
import getMapObject from "./utils/getMapObject.js";
import getRegex from "./utils/getRegex.js";

export default function applyCalculation(form) {
	form.find(".cwp-field.cwp-calculation").each(function () {
		let formula = $(this).attr("data-cwp-calculation");

		if (!formula) {
			return;
		}

		// let fields = formula.match(/[(number)\-\d\w]+/g);
		const f = formula.match(/[{{]+[\/number\-\d\w]+[}}]+/g);
		const fields = f.map((v) => v.substring(2, v.length - 2));
		const deciPlaces = Number($(this).data("deci"));

		const self = $(this),
			t = this;

		form.find("[data-cwp-field]").each(function () {
			$(this).on("input", function () {
				const target = $(this).attr("id").substring(0, 6);
				var replace = `number-${target}`;

				if (fields.includes(replace)) {
					self.attr(`data-${replace}`, $(this).val());
				}

				fields.forEach((field) => {
					let expression = formula;
					let regExp = getRegex(fields);

					const mapObj = getMapObject(fields, t.dataset);

					expression = expression.replace(regExp, function (matched) {
						return mapObj[matched];
					});

					const result = eval(expression).toFixed(deciPlaces);

					self.find("input").val(result);
					self.find(".cwp-calc-result").html(result);
				});
			});
			fields.forEach((field) => {
				let expression = formula;
				let regExp = getRegex(fields);

				const mapObj = getMapObject(fields, t.dataset);

				expression = expression.replace(regExp, function (matched) {
					return mapObj[matched];
				});

				const result = eval(expression).toFixed(deciPlaces);

				self.find("input").val(result);
				self.find(".cwp-calc-result").html(result);
			});

			const target = $(this).attr("id").substring(0, 6);
			var replace = `number-${target}`;

			if (fields.includes(replace)) {
				self.attr(
					`data-${replace}`,
					$(this).val() === "" ? 0 : $(this).val()
				);
			}
		});
	});
}
