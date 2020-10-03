jQuery(function ($) {
	function gutenbergFormsRecaptchaLoad() {
		// recaptcha required form elements
		$(".cwp-form").each(function () {
			const form = $(this)[0]; // current form

			// checking if the current form has recaptcha enabled
			const isRecaptchaEnabled = $(this).data("recaptchaenable");
			const sitekey = $(this).data("siteKey");

			console.log(form);

			if (isRecaptchaEnabled) {
				grecaptcha.render(form, {
					sitekey,
				});
			}
		});
	}

	window.gutenbergFormsRecaptchaLoad = gutenbergFormsRecaptchaLoad; // making it available globally
});
