import React from "react";

function ProgressBar(props) {
	const { attributes } = props;
	const {
		progressColor,
		progressFillColor,
		thickness,
		cornerRadius,
		showPercentage,
		textColor,
	} = attributes;

	const progressStyling = {
		backgroundColor: progressColor,
		height: thickness,
		borderRadius: cornerRadius,
	};

	const progressFillStyling = {
		backgroundColor: progressFillColor,
		borderRadius: cornerRadius,
	};

	const textStyling = {
		color: textColor,
	};

	return (
		<div
			className="cwp-gutenberg-form cwp-progress-bar"
			style={progressStyling}
		>
			<div className="bar-fill" style={progressFillStyling}>
				{showPercentage && thickness > 10 && (
					<span className="percentage-indicator" style={textStyling}>
						50%
					</span>
				)}
			</div>
		</div>
	);
}

export default ProgressBar;
