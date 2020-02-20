import React from "react";
import {
	PanelRow,
	PanelBody,
	ColorPalette,
	RangeControl
} from "@wordpress/components";
import { basicColorScheme } from "../../block/misc/helper";
import { set, clone } from "lodash";
import ConditionalLogic from "../../block/components/condition";

const { InspectorControls } = wp.blockEditor;

const { __ } = wp.i18n;

function Inspector(prop) {
	const props = prop.data,
		{
			styling,
			styling: { backgroundColor, color, padding },
			condition
		} = props.attributes;

	const handleStyling = (style, key) => {
		const groupStyling = clone(styling);

		set(groupStyling, key, style); //changing the color;

		props.setAttributes({ styling: groupStyling });
	};

	return (
		<InspectorControls>
			<PanelBody title={__("Styling")} icon="admin-appearance">
				<div className="cwp-option">
					<h3 className="cwp-heading">Background Color</h3>
					<ColorPalette
						colors={basicColorScheme}
						value={backgroundColor}
						onChange={color => handleStyling(color, "backgroundColor")}
					/>
				</div>
				<div className="cwp-option">
					<h3 className="cwp-heading">Color</h3>
					<ColorPalette
						colors={basicColorScheme}
						value={color}
						onChange={color => handleStyling(color, "color")}
					/>
				</div>
				<div className="cwp-option">
					<RangeControl
						value={padding}
						label={__("Padding")}
						onChange={padd => handleStyling(padd, "padding")}
					/>
				</div>
			</PanelBody>
			<PanelBody title={__("Condition")} icon="hidden">
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
