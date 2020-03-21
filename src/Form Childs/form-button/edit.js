import React from "react";
import {
	PanelBody,
	ColorPalette,
	RangeControl,
	ButtonGroup,
	Button,
	PanelRow
} from "@wordpress/components";
import { basicColorScheme, strip_tags, firstCapital } from "../../block/misc/helper";
import { clone, set } from "lodash";
import { getRootFormBlock } from "../../block/functions/index";
const { RichText, InspectorControls } = wp.blockEditor;

function edit(props) {
	const {
		styling,
		styling: { backgroundColor, color, padding },
		label,
		action
	} = props.attributes;


	const buttonStyling = {
		...styling,
		padding: `${Math.floor(padding / 3)}px ${padding}px `,

	}


	const handleStyling = (style, key) => {
		const buttonStyling = clone(styling);

		set(buttonStyling, key, style); //changing the color;

		props.setAttributes({ styling: buttonStyling });
	};

	const getActiveButtonGroup = (a, v) => {
		if (props.attributes[a] === v) {
			return {
				isPrimary: true
			};
		}

		return {
			isDefault: true
		};
	};

	const handleAction = (newAction) => {
		props.setAttributes({ action: newAction });


		if (strip_tags(label).toLowerCase() === action) {
			props.setAttributes({ label: firstCapital(newAction) })
		}

	}

	React.useEffect(() => {
		props.setAttributes({ parentId: getRootFormBlock(props.clientId).clientId });
	});

	return [
		<InspectorControls>
			<PanelBody title="Settings">
				<div className="cwp-option">
					<PanelRow>
						<h3>Action</h3>
						<ButtonGroup>
							<Button
								onClick={() => handleAction("reset")}
								{...getActiveButtonGroup("action", "reset")}
							>
								Reset
							</Button>
							<Button
								onClick={() => handleAction("submit")}
								{...getActiveButtonGroup("action", "submit")}
							>
								Submit
							</Button>
						</ButtonGroup>
					</PanelRow>
				</div>
			</PanelBody>
			<PanelBody title="Colors">
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
						min={0}
						max={100}
						label="Padding"
						value={padding}
						onChange={p => handleStyling(p, "padding")}
					/>
				</div>
			</PanelBody>
		</InspectorControls>,
		null,
		<button style={buttonStyling} className={props.className}>
			<RichText
				tag="span"
				value={label}
				onChange={label => props.setAttributes({ label })}
			/>
		</button>
	];
}

export default edit;
