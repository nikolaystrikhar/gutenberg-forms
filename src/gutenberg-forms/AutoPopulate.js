import $ from 'jquery';

export default class AutoPopulate {
	constructor(form) {
		this.form = $(form);
		this.populate();
	}

	getParameterByName(name) {
		let url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return "";
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	decodeCheckboxName(name) {
		let separated = name.split("__");
		let uriWithGroup = separated[1];
		const withoutGroup = uriWithGroup.split("[]")[0];

		return withoutGroup;
	}

	getDecodedFieldId(name, type, self) {
		let value;

		if (type === "range") {
			const parent = $(self)
				.parents(".cwp-range-set")
				.find("input[type='number']");
			name = parent.attr("name");
		}
		if (type === "checkbox") {
			value = this.decodeCheckboxName(name);
		} else {
			value = name.split("__")[1];
		}

		const decoded = window.atob(decodeURIComponent(value));
		const params = decoded.split("-");
		const field_id = params[params.length - 1];

		return field_id;
	}

	populate() {
		const fields = this.form.find("[data-cwp-field]");
		const t = this;
		fields.each(function () {
			const type = $(this).attr("type");

			const name = $(this).attr("name");
			const field_id = t.getDecodedFieldId(name, type, this);
			const queryValue = t.getParameterByName(field_id);

			if (type === "checkbox" && field_id !== null) {
				$(this)
					.parents(".cwp-checkbox")
					.find(`input[type="checkbox"]`)
					.each(() => {
						const value = $(this).val();
						const checkboxesValues =
							queryValue !== null ? queryValue.split(",") : "";

						if (checkboxesValues.includes(value)) {
							$(this).attr("checked", true);
						}
					});
			} else if (type === "radio" && field_id !== null) {
				$(this)
					.parents(".cwp-radio")
					.find(`input[type="radio"]`)
					.each(() => {
						const value = $(this).val();

						if (value === queryValue) {
							$(this).attr("checked", true);
						}
					});
			} else if (
				field_id !== null &&
				type !== "file" &&
				type !== "hidden" &&
				queryValue !== null
			) {
				$(this).val(queryValue);
			}
		});
	}
}
