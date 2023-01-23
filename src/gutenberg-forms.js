/* eslint-disable */
import pickaday from './gutenberg-forms/pickaday.js'
import Conditional from "./gutenberg-forms/Conditional.js";
import MultiStepForm from "./gutenberg-forms/MultiStepForm.js";
import AutoPopulate from "./gutenberg-forms/AutoPopulate.js";
import applyCalculation from "./gutenberg-forms/applyCalculation.js";
import addValidation from "./gutenberg-forms/addValidation.js";

jQuery.noConflict();

jQuery( document ).ready(function( $ ) {
	pickaday();

	$(document).ready(function() {
		$(".cwp-form").each(function () {
			const populator = new AutoPopulate(this);
		});

		$(".cwp-form").each(function () {
			let formRoot = $(this).find("form");

			let resubmit_btn = $(this).find(
				".cwp-add_another_submission button"
			);

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
						$(this)
							.parent()
							.find('input[type="hidden"]')
							.val("yes");
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
					if (
						$(this).find("input:checkbox").filter(":checked")
							.length < 1
					) {
						e.preventDefault();

						let errMessage = $(this).data("errors");

						if (!$(this).find(".cwp-warning").length) {
							$(this).append(`
              	<div class="cwp-warning">
              	  <div>
              	    <span class="dashicons dashicons-info"></span>
              	  </div>
					 			 	<div>
					  			${errMessage.empty.trim().length === 0
								? "Please select atleast one checkbox!"
								: errMessage.empty}
									</div>
                </div>
              `);
						}
					} else if ($(this).find(".cwp-warning").length) {
						$(this).find(".cwp-warning").remove();
					}
				});

				let required_radios = $(this).find(
					".cwp-radio-set.required-radio"
				);

				required_radios.each(function (index) {
					if (
						$(this).find("input:radio").filter(":checked").length <
						1
					) {
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


addValidation();