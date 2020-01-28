import React from "react";
const { InnerBlocks } = wp.blockEditor;

function save(props) {
	const {
		submitLabel,
		buttonSetting: { alignment },
		buttonSetting,
		id,
		successType,
		successMessage
	} = props.attributes;

	return (
		<div className="cwp-form">
			<form data-parsley-validate method="POST">
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
			{successType === "message" && (
				<div id={id} className="cwp-success cwp-hidden">
					{successMessage}
				</div>
			)}
		</div>
	);
}

export default save;
