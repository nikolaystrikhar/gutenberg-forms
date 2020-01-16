import React from "react";
import Inspector from "./Inspector";
const { InnerBlocks, RichText } = wp.blockEditor;

function edit(props) {
	const {
		submitLabel,
		buttonSetting: { alignment },
		buttonSetting
	} = props.attributes;

	const handleButtonLabel = label => {
		props.setAttributes({ submitLabel: label });
	};

	return [
		<Inspector data={props} />,
		null,
		<div className="cwp-form">
			<form>
				<InnerBlocks
					templateLock={false}
					renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
				/>
			</form>
			<div className={`cwp-submit ${alignment}`}>
				<button
					className="cwp-submit-btn"
					style={{
						backgroundColor: buttonSetting.backgroundColor,
						color: buttonSetting.color
					}}
				>
					<RichText
						tag="span"
						value={submitLabel}
						onChange={handleButtonLabel}
					/>
				</button>
			</div>
		</div>
	];
}

export default edit;
