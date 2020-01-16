import React from "react";
const { InnerBlocks } = wp.blockEditor;

function edit(props) {
	const {
		submitLabel,
		buttonSetting: { alignment },
		buttonSetting
	} = props.attributes;

	return (
		<div className="cwp-form">
			<form>
				<InnerBlocks.Content />
			</form>
			<div className={`cwp-submit ${alignment}`}>
				<button
					style={{
						backgroundColor: buttonSetting.backgroundColor,
						color: buttonSetting.color
					}}
					className="cwp-submit-btn"
					dangerouslySetInnerHTML={{ __html: submitLabel }}
				></button>
			</div>
		</div>
	);
}

export default edit;
