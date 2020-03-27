import React from "react";
import { ResizableBox } from "@wordpress/components";
import { InnerBlocks } from "@wordpress/block-editor";

function edit(props) {
	return (
		<div className="cwp-col">
			<InnerBlocks
				className="cwp-col_inserter"
				templateLock={false}
				renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
			/>
		</div>
	);
}

export default edit;
