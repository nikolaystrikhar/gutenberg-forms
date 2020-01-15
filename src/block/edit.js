import React from "react";
const { InnerBlocks } = wp.blockEditor;

function edit(props) {
	return (
		<div className="cwp-form">
			<InnerBlocks
				templateLock={false}
				renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
			/>
			<div className="cwp-submit">
				<button className="cwp-submit-btn">Submit</button>
			</div>
		</div>
	);
}

export default edit;
