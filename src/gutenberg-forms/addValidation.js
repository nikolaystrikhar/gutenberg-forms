export default function addValidation() {
	document.addEventListener("DOMContentLoaded", function () {
		var elements = document.querySelectorAll(".cwp-form [data-cwp-field]");

		elements.forEach((elem) => {
			elem.oninvalid = function (e) {
				if (e.target.dataset.errors) {
					const validityText = JSON.parse(e.target.dataset.errors);

					if (validityText.mismatch) {
						let mismatchWithValue = validityText.mismatch.replace(
							/{{value}}/g,
							e.target.value
						);

						e.target.setCustomValidity("");
						if (!e.target.validity.valid) {
							e.target.value === ""
								? e.target.setCustomValidity(validityText.empty)
								: e.target.setCustomValidity(mismatchWithValue);
						}
					} else if (validityText.empty) {
						e.target.setCustomValidity("");
						if (!e.target.validity.valid) {
							e.target.value === ""
								? e.target.setCustomValidity(validityText.empty)
								: null;
						}
					}
				}
			};
			elem.onkeydown = function (e) {
				if (e.target.dataset.errors) {
					e.target.setCustomValidity("");

					const parseErrors = JSON.parse(e.target.dataset.errors);
					const typeMismatchMessage = parseErrors.mismatch;

					if (parseErrors.mismatch) {
						let mismatchWithValue = typeMismatchMessage.replace(
							/{{value}}/g,
							e.target.value
						);

						e.target.setAttribute("title", mismatchWithValue);
						if (e.target.validity.typeMismatch) {
							e.target.setCustomValidity(
								mismatchWithValue ? mismatchWithValue : ""
							);
						}
					}
				}
			};
		});
	});
}
