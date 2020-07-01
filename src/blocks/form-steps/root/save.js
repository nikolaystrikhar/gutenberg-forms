import React from "react";

const { InnerBlocks } = wp.editor;

function save() {
	return (
		<div className="cwp-form-steps-wrapper">
			<InnerBlocks.Content />
		</div>
	);
}

export default save;
