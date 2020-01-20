import React from "react";
import { InnerBlocks } from "@wordpress/block-editor";

function save(props) {
	const { columns } = props.attributes;

	return (
		<div className="cwp-form-col-main-preview" data-cols={columns}>
			<InnerBlocks.Content />
		</div>
	);
}

export default save;
