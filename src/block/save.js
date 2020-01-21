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
			<form noValidate method="POST">
				<InnerBlocks.Content />
				<div className={`cwp-submit ${alignment}`}>
					<button
						type="submit"
						style={{
							backgroundColor: buttonSetting.backgroundColor,
							color: buttonSetting.color
						}}
						className="cwp-submit-btn"
						dangerouslySetInnerHTML={{ __html: submitLabel }}
					></button>
				</div>
			</form>
		</div>
	);
}

export default edit;
