import React from "react";
import {
	PanelRow,
	PanelBody,
	ColorPalette,
	RangeControl,
	Notice,
} from "@wordpress/components";
import { basicColorScheme } from "../../block/misc/helper";
import { set, clone } from "lodash";
import ConditionalLogic from "../../block/components/condition";
import { isChildFieldsRequired } from "../../block/functions";

const { InspectorControls } = wp.blockEditor;

const { __ } = wp.i18n;

function Inspector(prop) {
	const props = prop.data,
		{
			styling,
			styling: {
				backgroundColor,
				color,
				padding,
				borderColor,
				borderWidth,
				borderRadius,
			},
			condition,
			enableCondition,
		} = props.attributes;

	const handleStyling = (style, key) => {
		const groupStyling = clone(styling);

		set(groupStyling, key, style); //changing the color;

		props.setAttributes({ styling: groupStyling });
	};

	return (
		<InspectorControls>
			{isChildFieldsRequired(props.clientId) && enableCondition && (
				<Notice status="error" isDismissible={false}>
					{__(
						"Do not have a required fields inside a conditional group.",
						"forms-gutenberg"
					)}
				</Notice>
			)}
			<PanelBody title={__("Styling")}>
				<div className="cwp-option">
					<h3 className="cwp-heading">{__("Background Color", "forms-gutenberg")}</h3>
					<ColorPalette
						colors={basicColorScheme}
						value={backgroundColor}
						onChange={(color) => handleStyling(color, "backgroundColor")}
					/>
				</div>
				<div className="cwp-option">
					<h3 className="cwp-heading">{__("Color", "forms-gutenberg")}</h3>
					<ColorPalette
						colors={basicColorScheme}
						value={color}
						onChange={(color) => handleStyling(color, "color")}
					/>
				</div>

				<div className="cwp-option">
					<h3 className="cwp-heading">{__("Border Color", "forms-gutenberg")}</h3>
					<ColorPalette
						colors={basicColorScheme}
						value={borderColor}
						onChange={(color) => handleStyling(color, "borderColor")}
					/>
				</div>
				<div className="cwp-option">
					<h3 className="cwp-heading">
						{__("Border Width [px]", "forms-gutenberg")}
					</h3>
					<RangeControl
						value={borderWidth}
						min={0}
						max={20}
						onChange={(borderWidth) =>
							handleStyling(borderWidth, "borderWidth")
						}
					/>
				</div>
				<div className="cwp-option">
					<h3 className="cwp-heading">
						{__("Border Radius [px]", "forms-gutenberg")}
					</h3>
					<RangeControl
						value={borderRadius}
						min={0}
						max={100}
						initialPosition={0}
						onChange={(value) => handleStyling(value, "borderRadius")}
					/>
				</div>
				<div className="cwp-option">
					<RangeControl
						value={padding}
						label={__("Padding", "forms-gutenberg")}
						onChange={(padd) => handleStyling(padd, "padding")}
					/>
				</div>
			</PanelBody>
			<PanelBody title={__("Condition", "forms-gutenberg")}>
				<ConditionalLogic
					condition={condition}
					set={props.setAttributes}
					clientId={props.clientId}
					useCondition={props.attributes.enableCondition}
				/>
			</PanelBody>
		</InspectorControls>
	);
}

export default Inspector;
