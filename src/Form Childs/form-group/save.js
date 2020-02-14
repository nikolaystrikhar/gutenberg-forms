import React from "react";
const { InnerBlocks } = wp.blockEditor;

function save(props) {
	const { styling } = props.attributes;

	return (
		<div style={styling} className="cwp-form-group">
			<InnerBlocks.Content />
		</div>
	);
}

export default save;
