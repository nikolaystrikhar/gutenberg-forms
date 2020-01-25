import React from "react";
import {
	PanelRow,
	PanelBody,
	Button,
	ButtonGroup,
	Icon,
	ColorPicker,
	ColorPalette,
	TextControl,
	Notice
} from "@wordpress/components";
import { isEmpty } from "lodash";

const { InspectorControls } = wp.blockEditor;

function Inspector(prop) {
	const props = prop.data;

	const {
		buttonSetting,
		email,
		successURL,
		successType,
		successMessage
	} = props.attributes;

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

	const getSuccess = t => {
		return successType === t
			? {
					isPrimary: true
			  }
			: {
					isDefault: false
			  };
	};

	const colors = [
		{ name: "red", color: "#f00" },
		{ name: "white", color: "#fff" },
		{ name: "blue", color: "#00f" }
	];

	return (
		<InspectorControls>
			<PanelBody icon="admin-settings" title="Button Setting">
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
			<PanelBody icon="admin-users" title="Account Setting">
				{isEmpty(email) && (
					<Notice isDismissible={false} status="warning">
						By Default Email will be sent to the admin account
					</Notice>
				)}
				<div className="cwp-option">
					<TextControl
						label="Email Account"
						value={email}
						onChange={email => props.setAttributes({ email })}
					/>
				</div>
			</PanelBody>
			<PanelBody icon="yes" title="Success Setting">
				<div className="cwp-option">
					<PanelRow>
						<h3>Success Type</h3>
						<ButtonGroup>
							<Button
								{...getSuccess("url")}
								onClick={() => props.setAttributes({ successType: "url" })}
							>
								URL
							</Button>
							<Button
								{...getSuccess("message")}
								onClick={() => props.setAttributes({ successType: "message" })}
							>
								Message
							</Button>
						</ButtonGroup>
					</PanelRow>
				</div>
				<div className="cwp-option">
					{successType === "url" ? (
						<TextControl
							label="Success Url (Redirect)"
							value={successURL}
							onChange={successURL => props.setAttributes({ successURL })}
						/>
					) : (
						<TextControl
							label="Success Message"
							value={successMessage}
							onChange={successMessage =>
								props.setAttributes({ successMessage })
							}
						/>
					)}
				</div>
			</PanelBody>
		</InspectorControls>
	);
}

export default Inspector;
