jQuery(function ($) {
	$(".cwp-form form").each(function () {
		$(this)
			.find(".cwp-datepicker input")
			.each(function () {
				const format = $(this).data("format");

				const datePicker = new Pikaday({
					field: this,
					format,
					toString(date, format) {
						// you should do formatting based on the passed format,
						// but we will just return 'D/M/YYYY' for simplicity
						const day = date.getDate();
						const month = date.getMonth() + 1;
						const year = date.getFullYear();

						if (format === "DD/MM/YYYY") {
							return `${day}/${month}/${year}`;
						} else if (format === "MM/DD/YYYY") {
							return `${month}/${day}/${year}`;
						} else {
							return `${year}/${month}/${day}`;
						}
					},
				});
				datePicker.setMinDate(new Date("Thu Jan 1 1920"));
			});
	});

	class Conditional {
		constructor(form) {
			this.form = $(form);
			this.fields = this.form.find("[data-cwp-field]");
			this.conditionalFields = this.form.find("[data-condition]");

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
			const { conditionalFields } = this, t = this;

			conditionalFields.each(function () {
				let condition = t.parseCondition($(this).data("condition"));

				condition["elem"] = $(this);

				t.fields.each(function () {
					let target = $(this).attr("id").startsWith( condition["field"] );

					if ( target ) {
						condition.elem.toggle(
							t.buildCondition( $(this).val(), condition["operand"], condition["value"] )
						);
					}

					$(this).on("input", function () {
						let target = $(this).attr("id").startsWith(condition["field"]);
						let fieldValue;

						if ($(this).attr("type") === "checkbox") {
							fieldValue = [];
							t.form
								.find(`input[name="${$(this).attr("name")}"]:checked`)
								.each(function () {
									fieldValue.push($(this).val());
								});
						} else if ($(this).attr("type") === "file") {
							fieldValue = $(this).val().replace(/C:\\fakepath\\/i, "");
						} else {
							fieldValue = $(this).val();
						}

						if ( target ) {
							condition.elem.toggle(
								t.buildCondition( fieldValue, condition["operand"], condition["value"] )
							);
						}
					});
				});
			});
		}
	}

	class ProgressBar {
		constructor(bars) {
			this.bars = bars;
		}

		set(perc, animate = false) {
			const percentage = String(perc).concat("%");

			const { bars } = this;

			bars.each(function () {
				const fill = $(this).find(".bar-fill");
				const percentageIndicator = fill.find(".percentage-indicator");

				if (animate) {
					fill.animate(
						{
							width: percentage,
						},
						{
							duration: 1000,
							step: function (now) {
								if (percentageIndicator.length) {
									percentageIndicator.html(Math.floor(now) + "%");
								}
							},
						}
					);
				} else {
					fill.stop(true, true); // for stopping the ongoing animation
					fill.css("width", percentage);

					if (percentageIndicator.length) {
						percentageIndicator.html(percentage);
					}
				}
			});
		}
	}

	class MultiStepForm {
		constructor(target) {
			this.target = $(target);
			this.steps = this.target.find(".cwp-form-step");
			this.bars = this.target.find(".cwp-gutenberg-form.cwp-progress-bar");
			this.progressBarHandler = new ProgressBar(this.bars);

			this.init();
		}

		init() {
			const { steps } = this;
			//initializing progress bars

			// displaying the first step by default;
			steps.eq(0).addClass("cwp-active-step");
			this.handleEvents();
			this.handleProgress();
			this.handleDisability(); // disabling triggers that are invalid
		}

		handleDisability() {
			const { target, steps } = this;

			const triggers = target.find(".multistep-trigger");

			triggers.each(function () {
				const rootStep = $(this).parents(".cwp-form-step");
				const currentStep = target.find(".cwp-active-step");
				const currentStepIndex = steps.index(currentStep) + 1;
				const totalSteps = steps.length;

				if (rootStep.length) {
					const hasNextStep = rootStep.next().hasClass("cwp-form-step");
					const hasPrevStep = rootStep.prev().hasClass("cwp-form-step");

					if (!hasNextStep) {
						rootStep.find('[data-trigger="next"]').css("opacity", ".5");
					} else {
						rootStep.find('[data-trigger="next"]').css("opacity", "1");
					}

					if (!hasPrevStep) {
						rootStep.find('[data-trigger="previous"]').css("opacity", ".5");
					} else {
						rootStep.find('[data-trigger="previous"]').css("opacity", "1");
					}
				} else {
					if (totalSteps === currentStepIndex) {
						target.find('[data-trigger="next"]').css("opacity", ".5");
					} else {
						target.find('[data-trigger="next"]').css("opacity", "1");
					}

					if (currentStepIndex === 1) {
						target.find('[data-trigger="previous"]').css("opacity", ".5");
					} else {
						target.find('[data-trigger="previous"]').css("opacity", "1");
					}
				}
			});
		}

		checkValidity(fields) {
			let validity = true;

			fields.each(function () {
				const __field = $(this).find("[data-cwp-field]");
				let __is_field_valid_ = false;

				if (!__field.length) {
					__is_field_valid_ = false;
				} else {
					__is_field_valid_ = __field[0].checkValidity();
				}

				if (!__is_field_valid_) {
					validity = false;
				}
			});

			return validity;
		}

		reportValidity(fields) {
			fields.each(function () {
				const field = $(this).find("[data-cwp-field]");

				if (field.length) {
					field[0].reportValidity();
				}
			});
		}

		handleProgress(animate = true) {
			const { target, steps } = this;
			const totalSteps = steps.length;
			const currentStep = target.find(".cwp-active-step");
			const currentStepIndex = steps.index(currentStep) + 1;

			const currentPercentage = Math.floor(
				(currentStepIndex / totalSteps) * 100
			);

			this.progressBarHandler.set(currentPercentage, animate);
		}

		next() {
			const { target, steps } = this;
			const currentActiveStep = target.find(".cwp-active-step");
			const currentFields = currentActiveStep.find(".cwp-field");
			const hasNextStep = currentActiveStep.next().hasClass("cwp-form-step");

			const hasSlideAnimation = target.hasClass("cwp-slide-step");

			if (!this.checkValidity(currentFields)) {
				this.reportValidity(currentFields);
				return;
			}

			if (!hasNextStep) {
				return;
			}

			steps.removeClass("cwp-active-step from-next");
			currentActiveStep.next().addClass("cwp-active-step from-next");

			this.handleProgress();
			this.handleDisability();
		}

		prev() {
			const { target, steps } = this;
			const currentActiveStep = target.find(".cwp-active-step");
			const currentFields = currentActiveStep.find(".cwp-field");
			const hasPrevStep = currentActiveStep.prev().hasClass("cwp-form-step");

			if (!this.checkValidity(currentFields)) {
				this.reportValidity(currentFields);
				return;
			}

			if (!hasPrevStep) {
				return;
			}

			steps.removeClass("cwp-active-step from-before");
			currentActiveStep.prev().addClass("cwp-active-step from-before");
			this.handleProgress(false);
			this.handleDisability();
		}

		handleEvents() {
			const { target } = this;
			const t = this;

			target.find(".multistep-trigger").each(function () {
				const trigger = $(this).data("trigger");

				$(this).click(function (e) {
					e.preventDefault();

					if (trigger === "next") {
						t.next();
					} else if (trigger === "previous") {
						t.prev();
					}
				});
			});
		}
	}

	class AutoPopulate {
		constructor(form) {
			this.form = form;
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

	function getRegex(fields) {
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

	function getMapObject(fields, data) {
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

	function applyCalculation(form) {
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

	$().ready(function () {
		$(".cwp-form").each(function () {
			const populator = new AutoPopulate($(this));
		});

		$(".cwp-form").each(function () {
			let formRoot = $(this).find("form");

			let resubmit_btn = $(this).find(".cwp-add_another_submission button");

			if (resubmit_btn.length) {
				resubmit_btn.click(function () {
					$(this).parent().parent().parent().css("display", "none");
					formRoot.css("display", "block");
				});
			}
		});

		$(".cwp-form form").each(function () {
			// for auto population

			$(this)
				.find(".cwp-yes-no input[type='checkbox']")
				.change(function () {
					if ($(this).prop("checked")) {
						$(this).val("yes");
						$(this).parent().find('input[type="hidden"]').val("yes");
					} else {
						$(this).parent().find('input[type="hidden"]').val("no");
						$(this).val("no");
					}
				});

			$(this).on("submit", function (e) {

				let required_checkboxes = $(this).find(
					".cwp-checkbox-set.required-checkbox"
				);

				required_checkboxes.each(function (index) {
					if ($(this).find("input:checkbox").filter(":checked").length < 1) {
						e.preventDefault();

						let errMessage = $(this).data("errors");

						if (!$(this).find(".cwp-warning").length) {
							$(this).append(`
                    <div class="cwp-warning">
                      <div>
                        <span class="dashicons dashicons-info"></span>
                      </div>
					  <div>
					  ${
								errMessage.empty.trim().length === 0
									? "Please select atleast one checkbox!"
									: errMessage.empty
							}

                      </div>
                    </div>
                  `);
						}
					} else if ($(this).find(".cwp-warning").length) {
						$(this).find(".cwp-warning").remove();
					}
				});

				let required_radios = $(this).find(".cwp-radio-set.required-radio");

				required_radios.each(function (index) {
					if ($(this).find("input:radio").filter(":checked").length < 1) {
						let errMessage = $(this).data("errors");

						e.preventDefault();

						if (!$(this).find(".cwp-warning").length) {
							$(this).append(`
                      <div class="cwp-warning">
                        <div>
                          <span class="dashicons dashicons-info"></span>
                        </div>
                        <div>
						${
								errMessage.empty.trim().length === 0
									? "Please select radio!"
									: errMessage.empty
							}
                        </div>
                      </div>
                    `);
						}
					} else if ($(this).find(".cwp-warning").length) {
						$(this).find(".cwp-warning").remove();
					}
				});
				// Get form id
				let form_id = $(this).attr("id");
				window.location.href = `#${form_id}`;
			});

		});

		$(".cwp-form form").each(function () {
			let condition = new Conditional(this);
			const self = this;

			this.querySelectorAll(".cwp-reset_btn").forEach((resetBtn) => {
				resetBtn.onclick = (e) => {
					e.preventDefault();

					self.querySelectorAll("[data-cwp-field]").forEach((v) => {
						v.value = "";
					});
				};
			});

			let rangeSliders = $(this).find(".cwp-range-set");

			if (rangeSliders.length) {
				rangeSliders.each(function () {
					let rangeInput = $(this).find('input[type="range"]');
					let numberInput = $(this).find('input[type="number"]');

					rangeInput.on("input", function () {
						numberInput.val($(this).val());
					});
					numberInput.on("input", function () {
						rangeInput.val($(this).val());
					});
				});
			}

			if ($(this).find(".cwp-field.cwp-calculation").length) {
				applyCalculation($(this));
			}
		});

		$(".cwp-form").each(function () {
			if ($(this).data("formtype") === "multiStep") {
				const multiStepForm = new MultiStepForm(this);
			}
		});
	});
});

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
