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
import { changeChildValue } from "../../block/functions/index";
import { basicColorScheme } from "../../block/misc/helper";
import { TEXT_DOMAIN } from "../../block/constants";
import TemplateBuilder from "./components/templateBuilder";

const { InspectorControls } = wp.blockEditor;
const { __ } = wp.i18n;



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
		formType,
		recaptcha: { siteKey, clientSecret },
		hideFormOnSuccess,
		formLabel,
		cpt,
		saveToEntries,
		sendEmail
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
			<PanelBody initialOpen={false} title={__("Form Design", TEXT_DOMAIN)}>
				<div className="cwp-option">
					<h3 className="cwp-heading">{__("Accent Color", TEXT_DOMAIN)}</h3>
					<ColorPalette
						colors={basicColorScheme}
						value={theme.accentColor}
						onChange={color => handleStyling(color, "accentColor")}
					/>
				</div>
				<div className="cwp-option">
					<h3 className="cwp-heading">{__("Text Color", TEXT_DOMAIN)}</h3>
					<ColorPalette
						colors={basicColorScheme}
						value={theme.textColor}
						onChange={color => handleStyling(color, "textColor")}
					/>
				</div>
				<div className="cwp-option">
					<h3 className="cwp-heading">{__("Field Background Color", TEXT_DOMAIN)}</h3>
					<ColorPalette
						colors={basicColorScheme}
						value={theme.fieldBackgroundColor}
						onChange={color => handleStyling(color, "fieldBackgroundColor")}
					/>
				</div>
			</PanelBody>

			<PanelBody initialOpen={true} title={__("General", TEXT_DOMAIN)}>
				<TextControl
					label={__("Form Label", TEXT_DOMAIN)}
					value={formLabel}
					onChange={formLabel => props.setAttributes({ formLabel })}
				/>



				<div className="cwp-option">
					<PanelRow>
						<h3>{__("Record Entries", TEXT_DOMAIN)}</h3>
						<FormToggle
							checked={saveToEntries}
							onChange={() => props.setAttributes({ saveToEntries: !saveToEntries })}
						/>
					</PanelRow>
				</div>
				{
					formType !== "multiStep" && <div className="cwp-option">
						<PanelRow>
							<h3>{__("Disable Submit Button", TEXT_DOMAIN)}</h3>
							<FormToggle
								checked={buttonSetting.disable}
								onChange={() =>
									handleButtonSetting("disable", !buttonSetting.disable)
								}
							/>
						</PanelRow>
					</div>
				}
				{!buttonSetting.disable && (
					<Fragment>
						<div className="cwp-option column">
							<h3 className="cwp-heading">{__("Button Alignment", TEXT_DOMAIN)}</h3>
							<div className="cwp-column">
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
							</div>
						</div>
					</Fragment>
				)}
				<div className="cwp-option column">
					<h3>{__("Confirmation Type", TEXT_DOMAIN)}</h3>
					<div className="cwp-column">
						<ButtonGroup>
							<Button
								{...getSuccess("url")}
								onClick={() => props.setAttributes({ successType: "url" })}
							>
								{__("URL", TEXT_DOMAIN)}
							</Button>
							<Button
								{...getSuccess("message")}
								onClick={() => props.setAttributes({ successType: "message" })}
							>
								{__("Message", TEXT_DOMAIN)}
							</Button>
						</ButtonGroup>
					</div>
				</div>
				<div className="cwp-option">
					{successType === "url" ? (
						<TextControl
							label={__("Success Url (Redirect)", TEXT_DOMAIN)}
							value={successURL}
							onChange={successURL => props.setAttributes({ successURL })}
						/>
					) : (
							<TextareaControl
								label={__("Success Message", TEXT_DOMAIN)}
								value={successMessage}
								onChange={successMessage =>
									props.setAttributes({ successMessage })
								}
							/>
						)}
				</div>
				{
					successType === "message" && <div className="cwp-option">
						<PanelRow>
							<h3>{__("Hide Form On Success", TEXT_DOMAIN)}</h3>
							<FormToggle
								checked={hideFormOnSuccess}
								onChange={() => props.setAttributes({ hideFormOnSuccess: !hideFormOnSuccess })}
							/>
						</PanelRow>
					</div>
				}
			</PanelBody>
			<PanelBody title={__("Email Notification", TEXT_DOMAIN)}>
				<div className="cwp-option">
					<PanelRow>
						<h3>{__("Send Email Notification", TEXT_DOMAIN)}</h3>
						<FormToggle
							checked={sendEmail}
							onChange={() => props.setAttributes({ sendEmail: !sendEmail })}
						/>
					</PanelRow>
				</div>
				{
					sendEmail && <TemplateBuilder clientId={props.clientId} data={props} />
				}
			</PanelBody>
			<PanelBody initialOpen={false} title="reCAPTCHA v2">
				<div className="cwp-option">
					<p>
						{__("reCAPTCHA requires a Site and Private API key. Sign up for a free", TEXT_DOMAIN)}
						<a href="https://www.google.com/recaptcha" target="__blank">
							{__("reCAPTCHA key", TEXT_DOMAIN)}
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
							<Icon icon="info" /> {__("Will only work & show on front-end.", TEXT_DOMAIN)}
						</p>
					</div>
				)}
			</PanelBody>
			<PanelBody initialOpen={false} title="Messages">
				<div className="cwp-option">
					<p>
						<Icon icon="info" /> {
							__("You can edit validations messages used for various field types here. Use {{ value }} to insert field value.", TEXT_DOMAIN)
						}
					</p>
				</div>
				<MappedMessages val={messages} onChange={handleMessagesChange} />
			</PanelBody>
		</InspectorControls>
	);
}

export default Inspector;
