import React from "react";

function save(props) {
	const { id, value } = props.attributes;

	return (
		<div className="cwp-field cwp-hidden">
			<input id={id} name={id} type="hidden" readOnly value={value} />
		</div>
	);
}

export default save;
