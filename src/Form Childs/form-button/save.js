import React from "react";

function save(props) {
	const { styling, label, action, parentId, styling: { padding } } = props.attributes;

	const id = "submit-".concat(parentId);

	const buttonStyling = {
		...styling,
		padding: `${Math.floor(padding / 3)}px ${padding}px`,

	}

	return action === "submit" ? (
		<button
			style={buttonStyling}
			name="submit"
			value={id}
			type="submit"
			dangerouslySetInnerHTML={{ __html: label }}
		></button>
	) : (
			<button
				style={buttonStyling}
				className="cwp-reset_btn"
				dangerouslySetInnerHTML={{ __html: label }}
			></button>
		);
}

export default save;
