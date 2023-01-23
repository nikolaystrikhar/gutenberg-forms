import $ from 'jquery';

export default class ProgressBar {
	constructor(bars) {
		this.bars = $(bars);
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
