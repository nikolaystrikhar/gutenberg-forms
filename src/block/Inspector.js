import React from "react";
import {
	PanelRow,
	PanelBody,
	Button,
	ButtonGroup,
	Icon,
	ColorPicker,
	ColorPalette
} from "@wordpress/components";
const { InspectorControls } = wp.blockEditor;

function Inspector(prop) {
	const props = prop.data;

	const { buttonSetting } = props.attributes;

	const handleAlignment = aln => {
		props.setAttributes({
			buttonSetting: {
				...buttonSetting,
				alignment: aln
			}
		});
	};

	const getAlignmentProps = aln => {
		if (buttonSetting.alignment === aln)
			return {
				isDefault: true
			};

		return {
			isPrimary: true
		};
	};

	const handleButtonSetting = (t, v) => {
		props.setAttributes({
			buttonSetting: {
				...buttonSetting,
				[t]: v
			}
		});
	};

	const colors = [
		{ name: "red", color: "#f00" },
		{ name: "white", color: "#fff" },
		{ name: "blue", color: "#00f" }
	];

	return (
		<InspectorControls>
			<PanelBody title="Button Setting">
				<div className="cwp-option">
					<PanelRow>
						<h3 className="cwp-heading">Alignment</h3>
						<ButtonGroup>
							<Button
								{...getAlignmentProps("justify-start")}
								onClick={() => handleAlignment("justify-start")}
							>
								<Icon icon="editor-alignleft" />
							</Button>
							<Button
								{...getAlignmentProps("justify-center")}
								onClick={() => handleAlignment("justify-center")}
							>
								<Icon icon="editor-aligncenter" />
							</Button>
							<Button
								{...getAlignmentProps("justify-end")}
								onClick={() => handleAlignment("justify-end")}
							>
								<Icon icon="editor-alignright" />
							</Button>
						</ButtonGroup>
					</PanelRow>
				</div>
				<div className="cwp-option">
					<h3 className="cwp-heading">Background Color</h3>
					<ColorPicker
						color={buttonSetting.backgroundColor}
						onChangeComplete={c =>
							handleButtonSetting("backgroundColor", c.hex)
						}
						disableAlpha
					/>
				</div>
				<div className="cwp-option">
					<h3 className="cwp-heading">Color</h3>
					<ColorPalette
						colors={colors}
						value={buttonSetting.color}
						onChange={color => handleButtonSetting("color", color)}
					/>
				</div>
			</PanelBody>
		</InspectorControls>
	);
}

export default Inspector;
