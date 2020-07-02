import React from "react";

function save(props) {
	const {
		styling,
		label,
		action,
		parentId,
		styling: { padding },
	} = props.attributes;

	const buttonStyling = {
		...styling,
		padding: `${Math.floor(padding / 3)}px ${padding}px`,
	};

	switch (action) {
		case "submit":
			return (
				<button
					style={buttonStyling}
					name="submit"
					value={parentId}
					type="submit"
					dangerouslySetInnerHTML={{ __html: label }}
				></button>
			);
		case "reset":
			return (
				<button
					style={buttonStyling}
					className="cwp-reset_btn"
					dangerouslySetInnerHTML={{ __html: label }}
				></button>
			);
		default:
			return (
				<button
					style={buttonStyling}
					data-trigger={action}
					className={`cwp-multistep_btn multistep-trigger`}
					dangerouslySetInnerHTML={{ __html: label }}
				></button>
			);
	}
}

export default save;
