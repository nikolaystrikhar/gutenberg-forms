import React from "react";
import { InnerBlocks } from "@wordpress/block-editor";

function save(props) {
	return (
		<div className="cwp-col">
			<InnerBlocks.Content />
		</div>
	);
}

export default save;
