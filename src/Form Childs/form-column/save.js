import React from "react";
import { InnerBlocks } from "@wordpress/block-editor";

function save(props) {
	const { columns, stack } = props.attributes,
		stackClass = stack ? "cwp_stack_columns" : "";

	return (
		<div
			className={`cwp-form-col-main-preview ${stackClass}`}
			data-cols={columns}
		>
			<InnerBlocks.Content />
		</div>
	);
}

export default save;
