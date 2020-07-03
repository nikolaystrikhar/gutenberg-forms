import React from "react";
import { RangeControl, PanelBody } from "@wordpress/components";
import { TEXT_DOMAIN } from "../../block/constants/index";

const { InspectorControls, InnerBlocks } = wp.blockEditor;
const { __ } = wp.i18n;
const $ = jQuery;

function edit(props) {
	const { width } = props.attributes;
	const { attributes, setAttributes, clientId } = props;

	const updateAttribute = (key, value) => {
		const currentBlockId = "#block-".concat(clientId);
		const currentBlockElement = $(currentBlockId);

		if (key === "width" && currentBlockElement.length) {
			currentBlockElement.css("flex-basis", String(value).concat("%")); // updating the dom width
		}

		setAttributes({
			[key]: value,
		});
	};

	const columnStyling = {
		flexBasis: String(width).concat("%"),
	};

	return [
		<div className="cwp-col">
			<InnerBlocks
				templateLock={false}
				style={{
					backgroundColor: "red",
				}}
				className="cwp-col_inserter"
				renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
			/>
		</div>,
		null,
		!!props.isSelected && (
			<InspectorControls>
				<PanelBody
					initialOpen={true}
					title={__("Column Settings", TEXT_DOMAIN)}
				>
					<RangeControl
						value={width}
						allowReset
						label={__("Width (%)", TEXT_DOMAIN)}
						onChange={(newWidth) => updateAttribute("width", newWidth)}
					/>
				</PanelBody>
			</InspectorControls>
		),
	];
}

export default edit;
