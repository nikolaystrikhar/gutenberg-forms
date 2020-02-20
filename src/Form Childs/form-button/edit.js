import React from "react";
import {
	PanelBody,
	ColorPalette,
	RangeControl,
	ButtonGroup,
	Button,
	PanelRow
} from "@wordpress/components";
import { basicColorScheme } from "../../block/misc/helper";
import { clone, set } from "lodash";
const { getBlockParents } = wp.data.select("core/block-editor");
const { RichText, InspectorControls } = wp.blockEditor;

function edit(props) {
	const {
		styling,
		styling: { backgroundColor, color, padding },
		label,
		action
	} = props.attributes;

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

	React.useEffect(() => {
		props.setAttributes({ parentId: getBlockParents(props.clientId)[0] });
	});

	return [
		<InspectorControls>
			<PanelBody title="Settings" icon="admin-generic">
				<div className="cwp-option">
					<PanelRow>
						<h3>Action</h3>
						<ButtonGroup>
							<Button
								onClick={() => props.setAttributes({ action: "reset" })}
								{...getActiveButtonGroup("action", "reset")}
							>
								Reset
							</Button>
							<Button
								onClick={() => props.setAttributes({ action: "submit" })}
								{...getActiveButtonGroup("action", "submit")}
							>
								Submit
							</Button>
						</ButtonGroup>
					</PanelRow>
				</div>
			</PanelBody>
			<PanelBody title="Styling" icon="admin-appearance">
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
		<button style={styling} className={props.className}>
			<RichText
				tag="span"
				value={label}
				onChange={label => props.setAttributes({ label })}
			/>
		</button>
	];
}

export default edit;
