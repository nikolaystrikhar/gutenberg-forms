import React from "react";
import ProgressBar from "./components/progressBar";
import {
	ColorPalette,
	PanelBody,
	RangeControl,
	PanelRow,
	FormToggle,
	Notice,
} from "@wordpress/components";
import { TEXT_DOMAIN } from "../../block/constants";
import { basicColorScheme } from "../../block/misc/helper";

const { InspectorControls } = wp.blockEditor;
const { __ } = wp.i18n;

function edit(props) {
	const {
		progressColor,
		progressFillColor,
		thickness,
		cornerRadius,
		showPercentage,
		textColor,
	} = props.attributes;

	return [
		<InspectorControls>
			<PanelBody
				initialOpen={true}
				title={__("Progress Settings", TEXT_DOMAIN)}
			>
				<div className="cwp-option">
					<h3 className="cwp-heading">{__("Base Color", TEXT_DOMAIN)}</h3>
					<ColorPalette
						colors={basicColorScheme}
						value={progressColor}
						onChange={(pBg) => props.setAttributes({ progressColor: pBg })}
					/>
				</div>
				<div className="cwp-option">
					<h3 className="cwp-heading">{__("Fill Color", TEXT_DOMAIN)}</h3>
					<ColorPalette
						colors={basicColorScheme}
						value={progressFillColor}
						onChange={(pfBg) =>
							props.setAttributes({ progressFillColor: pfBg })
						}
					/>
				</div>
				<div className="cwp-option">
					<RangeControl
						label={__("Thickness", TEXT_DOMAIN)}
						value={thickness}
						min={5}
						max={50}
						onChange={(thickness) => props.setAttributes({ thickness })}
					/>
				</div>
				<div className="cwp-option">
					<RangeControl
						label={__("Corner Radius", TEXT_DOMAIN)}
						value={cornerRadius}
						min={0}
						max={100}
						onChange={(cornerRadius) => props.setAttributes({ cornerRadius })}
					/>
				</div>
				{showPercentage && thickness <= 10 && (
					<Notice status="error" isDismissible={false}>
						{__("Too Thin to show percentage text")}
					</Notice>
				)}
				<div className="cwp-option">
					<PanelRow>
						{__("Show Percentage", TEXT_DOMAIN)}
						<FormToggle
							checked={showPercentage}
							onChange={() =>
								props.setAttributes({ showPercentage: !showPercentage })
							}
						/>
					</PanelRow>
				</div>
				{showPercentage && (
					<div className="cwp-option">
						<h3 className="cwp-heading">{__("Text Color", TEXT_DOMAIN)}</h3>
						<ColorPalette
							colors={basicColorScheme}
							value={textColor}
							onChange={(textColor) => props.setAttributes({ textColor })}
						/>
					</div>
				)}
			</PanelBody>
		</InspectorControls>,
		null,
		<ProgressBar {...props} />,
	];
}

export default edit;
