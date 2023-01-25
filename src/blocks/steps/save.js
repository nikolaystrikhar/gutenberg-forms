import React from "react";

const { InnerBlocks } = wp.editor;

function save(props) {
	const { multiStepEffect } = props.attributes;

	return (
		<div className={`cwp-form-steps-wrapper ${multiStepEffect}`}>
			<InnerBlocks.Content />
		</div>
	);
}

export default save;
