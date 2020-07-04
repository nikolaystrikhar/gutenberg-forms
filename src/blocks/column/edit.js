import React from "react";
import { RangeControl, PanelBody } from "@wordpress/components";
import { TEXT_DOMAIN } from "../../block/constants/index";
import { hasChildBlocks } from "../../block/functions";

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
			const widthInPercentage = String(value).concat("%");
			currentBlockElement.css("flex-basis", widthInPercentage); // updating the dom width
		}

		setAttributes({
			[key]: value,
		});
	};

	return [
		<div className="cwp-col">
			<InnerBlocks
				templateLock={false}
				className="cwp-col_inserter"
				renderAppender={() => {
					return hasChildBlocks(clientId) ? (
						<InnerBlocks.ButtonBlockAppender />
					) : undefined;
				}}
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
						label={__("Width (%)", TEXT_DOMAIN)}
						onChange={(newWidth) => updateAttribute("width", newWidth)}
					/>
				</PanelBody>
			</InspectorControls>
		),
	];
}

export default edit;
