import $ from 'jquery';
import ProgressBar from "./ProgressBar.js";

export default class MultiStepForm {
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
					rootStep
						.find('[data-trigger="previous"]')
						.css("opacity", ".5");
				} else {
					rootStep
						.find('[data-trigger="previous"]')
						.css("opacity", "1");
				}
			} else {
				if (totalSteps === currentStepIndex) {
					target.find('[data-trigger="next"]').css("opacity", ".5");
				} else {
					target.find('[data-trigger="next"]').css("opacity", "1");
				}

				if (currentStepIndex === 1) {
					target
						.find('[data-trigger="previous"]')
						.css("opacity", ".5");
				} else {
					target
						.find('[data-trigger="previous"]')
						.css("opacity", "1");
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
