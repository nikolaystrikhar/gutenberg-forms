import React from "react";
const { InnerBlocks } = wp.blockEditor;

function save(props) {
	const {
		submitLabel,
		buttonSetting: { alignment },
		buttonSetting,
		id
	} = props.attributes;

	return (
		<div className="cwp-form">
			<form noValidate method="POST">
				<InnerBlocks.Content />
				<div className={`cwp-submit ${alignment}`}>
					<button
						name="submit"
						value={id}
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

export default save;
