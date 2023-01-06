jQuery(function ($) {
	function gutenbergFormsRecaptchaLoad() {
		// recaptcha required form elements
		$(".cwp-form").each(function () {
			// checking if the current form has recaptcha enabled
			const is_recaptcha_enabled = $(this).data("recaptchaenable");

			if (is_recaptcha_enabled) {
				const form    = $(this)[0]; // current form
				const sitekey = $(this).data("siteKey");

				grecaptcha.render(form, { sitekey });
			}
		});
	}

	window.gutenbergFormsRecaptchaLoad = gutenbergFormsRecaptchaLoad; // making it available globally
});
