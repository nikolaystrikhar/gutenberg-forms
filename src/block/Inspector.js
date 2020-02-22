import React, { Fragment, useEffect } from "react";
import {
	PanelRow,
	PanelBody,
	Button,
	ButtonGroup,
	Icon,
	ColorPicker,
	ColorPalette,
	TextControl,
	TextareaControl,
	FormToggle,
	Notice
} from "@wordpress/components";
import { set, clone } from "lodash";
import MappedMessages from "./components/messages";
import { changeChildValue } from "./functions/index";
import { basicColorScheme } from "./misc/helper";

const { InspectorControls } = wp.blockEditor;

function Inspector(prop) {
	const props = prop.data;

	const {
		buttonSetting,
		email,
		successURL,
		successType,
		messages,
		successMessage,
		templateBuilder,
		recaptcha,
		theme,
		recaptcha: { siteKey, clientSecret }
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
				isPrimary: true
			};

		return {
			isDefault: true
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
					isDefault: true
			  };
	};

	const colors = [
		{ name: "red", color: "#f00" },
		{ name: "white", color: "#fff" },
		{ name: "blue", color: "#00f" }
	];

	const handleCaptcha = (v, t) => {
		props.setAttributes({ recaptcha: { ...recaptcha, [t]: v } });
	};

	const handleMessagesChange = (t, v, i, fieldName) => {
		let newMessages = clone(messages);

		newMessages[i] = {
			...newMessages[i],
			[t]: v
		};
		props.setAttributes({ messages: newMessages });
		changeChildValue(fieldName, props.clientId, newMessages[i], t, messages);
	};

	const handleStyling = (style, key) => {
		const themeStyling = clone(theme);

		set(themeStyling, key, style); //changing the color;

		props.setAttributes({ theme: themeStyling });
	};

	return (
		<InspectorControls>
			<PanelBody initialOpen={true} icon="admin-settings" title="General">
				<div className="cwp-option">
					<PanelRow>
						<h3>Disable Submit Button</h3>
						<FormToggle
							checked={buttonSetting.disable}
							onChange={() =>
								handleButtonSetting("disable", !buttonSetting.disable)
							}
						/>
					</PanelRow>
				</div>
				{!buttonSetting.disable && (
					<Fragment>
						<div className="cwp-option">
							<PanelRow>
								<h3 className="cwp-heading">Button Alignment</h3>
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
					</Fragment>
				)}
			</PanelBody>
			<PanelBody initialOpen={false} icon="info" title="Notification">
				<div className="cwp-option">
					<PanelRow>
						<h3>Email Builder</h3>
						<FormToggle
							checked={templateBuilder}
							onChange={s =>
								props.setAttributes({ templateBuilder: !templateBuilder })
							}
						/>
					</PanelRow>
				</div>
			</PanelBody>
			<PanelBody initialOpen={false} icon="yes" title="Confirmation">
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
						<TextareaControl
							label="Success Message"
							value={successMessage}
							onChange={successMessage =>
								props.setAttributes({ successMessage })
							}
						/>
					)}
				</div>
			</PanelBody>
			<PanelBody initialOpen={false} icon="googleplus" title="reCAPTCHA v2">
				<div className="cwp-option">
					<p>
						reCAPTCHA requires a Site and Private API key. Sign up for a free{" "}
						<a href="https://www.google.com/recaptcha" target="__blank">
							reCAPTCHA key
						</a>
						.
					</p>
				</div>
				<div className="cwp-option">
					<PanelRow>
						<h3>Enable</h3>
						<FormToggle
							checked={recaptcha.enable}
							onChange={s => handleCaptcha(!recaptcha.enable, "enable")}
						/>
					</PanelRow>
				</div>
				{recaptcha.enable && (
					<Fragment>
						<div className="cwp-option">
							<TextControl
								label="Site Key"
								value={siteKey}
								onChange={v => handleCaptcha(v, "siteKey")}
							/>
						</div>
						<div className="cwp-option">
							<TextControl
								label="Client Secret"
								value={clientSecret}
								onChange={v => handleCaptcha(v, "clientSecret")}
							/>
						</div>
					</Fragment>
				)}
				{recaptcha.enable && (
					<div className="cwp-option">
						<p>
							<Icon icon="info" /> Will only work & show on front-end.
						</p>
					</div>
				)}
			</PanelBody>
			<PanelBody initialOpen={false} title="Messages" icon="email">
				<MappedMessages val={messages} onChange={handleMessagesChange} />
			</PanelBody>
			<PanelBody initialOpen={false} icon="admin-appearance" title="Theme">
				<div className="cwp-option">
					<h3 className="cwp-heading">Accent Color</h3>
					<ColorPalette
						colors={basicColorScheme}
						value={theme.accentColor}
						onChange={color => handleStyling(color, "accentColor")}
					/>
				</div>
				<div className="cwp-option">
					<h3 className="cwp-heading">Text Color</h3>
					<ColorPalette
						colors={basicColorScheme}
						value={theme.textColor}
						onChange={color => handleStyling(color, "textColor")}
					/>
				</div>
				<div className="cwp-option">
					<h3 className="cwp-heading">Field Background Color</h3>
					<ColorPalette
						colors={basicColorScheme}
						value={theme.fieldBackgroundColor}
						onChange={color => handleStyling(color, "fieldBackgroundColor")}
					/>
				</div>
			</PanelBody>
		</InspectorControls>
	);
}

export default Inspector;
