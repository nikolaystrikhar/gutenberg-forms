import React from "react";
const { InnerBlocks } = wp.blockEditor;

function save(props) {
	const { styling, label } = props.attributes;

	return (
		<fieldset style={styling} className="cwp-form-group">
			<legend dangerouslySetInnerHTML={{ __html: label }}></legend>
			<div className="cwp-group-fields">
				<InnerBlocks.Content />
			</div>
		</fieldset>
	);
}

export default save;
