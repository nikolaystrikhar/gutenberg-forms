import $ from 'jquery';

export default class Conditional {
	constructor(form) {
		this.form = $(form);
		this.fields = this.form.find("[data-cwp-field]");
		this.conditionalFields = this.form.find(
			"[data-condition]:not([data-condition=''])"
		);

		if (this.conditionalFields.length) {
			this.init();
		}
	}

	parseCondition(cond) {
		const field_id = cond.field.split("-");

		return {
			fieldName: field_id[0],
			field: field_id[field_id.length - 1],
			operand: cond.condition,
			value: cond.value,
		};
	}

	buildCondition(value, operand, condValue) {
		if (value instanceof Array) {
			switch (operand) {
				case "===":
					return JSON.stringify(value) === JSON.stringify(condValue);
				case "!==":
					return JSON.stringify(value) !== JSON.stringify(condValue);
			}
		} else {
			switch (operand) {
				case "===":
					return value === condValue;
				case "!==":
					return value !== condValue;
			}
		}
	}

	init() {
		const { conditionalFields } = this,
			t = this;

		conditionalFields.each(function () {
			let condition = t.parseCondition($(this).data("condition"));

			condition["elem"] = $(this);

			t.fields.each(function () {
				let target = $(this).attr("id").startsWith(condition["field"]);

				if (target) {
					condition.elem.toggle(
						t.buildCondition(
							$(this).val(),
							condition["operand"],
							condition["value"]
						)
					);
				}

				$(this).on("input", function () {
					let target = $(this)
						.attr("id")
						.startsWith(condition["field"]);
					let fieldValue;

					if ($(this).attr("type") === "checkbox") {
						fieldValue = [];
						t.form
							.find(
								`input[name="${$(this).attr("name")}"]:checked`
							)
							.each(function () {
								fieldValue.push($(this).val());
							});
					} else if ($(this).attr("type") === "file") {
						fieldValue = $(this)
							.val()
							.replace(/C:\\fakepath\\/i, "");
					} else {
						fieldValue = $(this).val();
					}

					if (target) {
						condition.elem.toggle(
							t.buildCondition(
								fieldValue,
								condition["operand"],
								condition["value"]
							)
						);
					}
				});
			});
		});
	}
}
