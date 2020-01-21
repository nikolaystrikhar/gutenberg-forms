import React from "react";
import Inspector from "./Inspector";
import TemplateBuilder from "./components/templateBuilder";
const { InnerBlocks, RichText, BlockControls, BlockIcon } = wp.blockEditor;
const { Button, Dashicon, IconButton, Toolbar, Tooltip } = wp.components;
const { __ } = wp.i18n;

function edit(props) {
	const {
		submitLabel,
		buttonSetting: { alignment },
		buttonSetting,
		templateBuilder,
		template
	} = props.attributes;

	const handleButtonLabel = label => {
		props.setAttributes({ submitLabel: label });
	};

	return [
		<Inspector data={props} />,
		<BlockControls>
			<Toolbar>
				<Tooltip text={__(templateBuilder ? "Preview Form" : "Template Builder")}>
					<Button
						onClick={() => {
							props.setAttributes({ templateBuilder: !templateBuilder });
						}}
					>
						<BlockIcon
							icon={templateBuilder ? "welcome-view-site" : "edit"}
							showColors
						/>
					</Button>
				</Tooltip>
			</Toolbar>
		</BlockControls>,
		!templateBuilder ? (
			<div className="cwp-form">
				<InnerBlocks
					templateLock={false}
					renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
				/>
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
		) : (
			<div className="cwp-form">
				<TemplateBuilder />
			</div>
		)
	];
}

export default edit;
