import React from "react";
import Inspector from "./Inspector";
const { InnerBlocks, RichText } = wp.blockEditor;

function edit(props) {
	const { styling, label } = props.attributes;

	const handleLabel = label => {
		props.setAttributes({ label });
	};

	return [
		!!props.isSelected && <Inspector data={props} />,
		null,
		<fieldset style={styling} className="cwp-form-group">
			<RichText tag="legend" onChange={handleLabel} value={label} />
			<div className="cwp-group-fields">
			<InnerBlocks />
			</div>
		</fieldset>
	];
}

export default edit;
