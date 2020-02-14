import React from "react";
import Inspector from "./Inspector";
const { InnerBlocks } = wp.blockEditor;

function edit(props) {
	const { styling } = props.attributes;

	return [
		!!props.isSelected && <Inspector data={props} />,
		null,
		<div style={styling} className="cwp-form-group">
			<InnerBlocks />
		</div>
	];
}

export default edit;
