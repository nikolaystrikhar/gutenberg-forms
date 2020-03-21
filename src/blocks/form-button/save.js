import React from "react";

function save(props) {
	const { styling, label, action, parentId } = props.attributes;

	const id = "submit-".concat(parentId);

	return action === "submit" ? (
		<button
			style={styling}
			name="submit"
			value={id}
			type="submit"
			dangerouslySetInnerHTML={{ __html: label }}
		></button>
	) : (
		<button
			style={styling}
			className="cwp-reset_btn"
			dangerouslySetInnerHTML={{ __html: label }}
		></button>
	);
}

export default save;
