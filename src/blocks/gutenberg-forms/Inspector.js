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
	Notice,
	FormTokenField,
	SelectControl,
} from "@wordpress/components";
import { set, clone, isEqual, isEmpty, get, map, includes } from "lodash";
import MappedMessages from "./components/messages";
import {
	changeChildValue,
	get_form_actions,
	get_spam_protectors,
	hasObject,
	getRootFormBlock,
} from "../../block/functions/index";
import { basicColorScheme } from "../../block/misc/helper";
import TemplateBuilder from "./components/templateBuilder";
import Integrations from "./components/Integrations";

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
		theme,
		formType,
		hideFormOnSuccess,
		formLabel,
		cpt,
		saveToEntries,
		sendEmail,
		actions,
		spamProtections,
		buttonStyling,
		spamMessage,
		errorMessage,
		customAction
	} = props.attributes;

	const handleAlignment = (aln) => {
		props.setAttributes({
			buttonSetting: {
				...buttonSetting,
				alignment: aln,
			},
		});
	};

	const getAlignmentProps = (aln) => {
		if (buttonSetting.alignment === aln)
			return {
				isPrimary: true,
			};

		return {
			isDefault: true,
		};
	};

	const handleButtonSetting = (t, v) => {
		props.setAttributes({
			buttonSetting: {
				...buttonSetting,
				[t]: v,
			},
		});
	};

	const getSuccess = (t) => {
		return successType === t
			? {
					isPrimary: true,
			  }
			: {
					isDefault: true,
			  };
	};

	const handleMessagesChange = (t, v, i, fieldName) => {
		let newMessages = clone(messages);

		newMessages[i] = {
			...newMessages[i],
			[t]: v,
		};
		props.setAttributes({ messages: newMessages });
		changeChildValue(fieldName, props.clientId, newMessages[i], t, messages);
	};

	const handleStyling = (style, key) => {
		const themeStyling = clone(theme);

		set(themeStyling, key, style); //changing the color;

		props.setAttributes({ theme: themeStyling });
	};

	const handleProtection = (protection) => {
		const enabled = hasObject(spamProtections, protection);

		if (enabled === false) {
			const newProtections = clone(spamProtections);
			newProtections.push(protection);
			props.setAttributes({ spamProtections: newProtections });
		} else {
			const newProtections = clone(spamProtections);
			let disabled = newProtections.filter((p) => !isEqual(p, protection));

			props.setAttributes({ spamProtections: disabled });
		}
	};

	const handleButtonStyling = (v, t) => {
		const newStyling = clone(buttonStyling);

		set(newStyling, t, v);

		props.setAttributes({ buttonStyling: newStyling });
	};

	const handleActions = (actions) => {
		// only update actions of integrations that are available
		const globalIntegrations = get(window, "cwpGlobal.settings.integrations");
		const integrations_titles = map(globalIntegrations, "title");
		let isCurrentActionSupported = true;

		actions.forEach((action) => {
			const exceptionalCases = ["Record Entries", "Email Notification"];

			if (
				!includes(integrations_titles, action) &&
				!includes(exceptionalCases, action)
			) {
				isCurrentActionSupported = false;
			}
		});

		if (isCurrentActionSupported) {
			props.setAttributes({ actions });
		}
	};

	return (
		<InspectorControls>
			<PanelBody initialOpen={false} title={__("Form Design", "forms-gutenberg")}>
				<div className="cwp-option">
					<h3 className="cwp-heading">{__("Accent Color", "forms-gutenberg")}</h3>
					<ColorPalette
						colors={basicColorScheme}
						value={theme.accentColor}
						onChange={(color) => handleStyling(color, "accentColor")}
					/>
				</div>
				<div className="cwp-option">
					<h3 className="cwp-heading">{__("Text Color", "forms-gutenberg")}</h3>
					<ColorPalette
						colors={basicColorScheme}
						value={theme.textColor}
						onChange={(color) => handleStyling(color, "textColor")}
					/>
				</div>
				<div className="cwp-option">
					<h3 className="cwp-heading">
						{__("Field Background Color", "forms-gutenberg")}
					</h3>
					<ColorPalette
						colors={basicColorScheme}
						value={theme.fieldBackgroundColor}
						onChange={(color) => handleStyling(color, "fieldBackgroundColor")}
					/>
				</div>
				<div className="cwp-option">
					<h3 className="cwp-heading">
						{__("Button Background Color", "forms-gutenberg")}
					</h3>
					<ColorPalette
						value={buttonStyling.backgroundColor}
						onChange={(newbg) => handleButtonStyling(newbg, "backgroundColor")}
						colors={basicColorScheme}
					/>
				</div>
			</PanelBody>

			<PanelBody initialOpen={true} title={__("General", "forms-gutenberg")}>
				<TextControl
					disabled
					label={__("Form Label", "forms-gutenberg")}
					value={formLabel}
					onChange={(formLabel) => props.setAttributes({ formLabel })}
				/>

				{formType !== "multiStep" && (
					<div className="cwp-option">
						<PanelRow>
							<h3>{__("Disable Submit Button", "forms-gutenberg")}</h3>
							<FormToggle
								checked={buttonSetting.disable}
								onChange={() =>
									handleButtonSetting("disable", !buttonSetting.disable)
								}
							/>
						</PanelRow>
					</div>
				)}
				{!buttonSetting.disable && (
					<Fragment>
						<div className="cwp-option column">
							<h3 className="cwp-heading">
								{__("Button Alignment", "forms-gutenberg")}
							</h3>
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
					<h3>{__("Confirmation Type", "forms-gutenberg")}</h3>
					<div className="cwp-column">
						<ButtonGroup>
							<Button
								{...getSuccess("url")}
								onClick={() => props.setAttributes({ successType: "url" })}
							>
								{__("URL", "forms-gutenberg")}
							</Button>
							<Button
								{...getSuccess("message")}
								onClick={() => props.setAttributes({ successType: "message" })}
							>
								{__("Message", "forms-gutenberg")}
							</Button>
						</ButtonGroup>
					</div>
				</div>
				<div className="cwp-option">
					{successType === "url" ? (
						<TextControl
							label={__("Success Url (Redirect)", "forms-gutenberg")}
							value={successURL}
							onChange={(successURL) => props.setAttributes({ successURL })}
						/>
					) : (
						<Fragment>
							<TextareaControl
								label={__("Success Message", "forms-gutenberg")}
								value={successMessage}
								onChange={(successMessage) =>
									props.setAttributes({ successMessage })
								}
							/>
							<TextareaControl
								label={__("Spam Message", "forms-gutenberg")}
								value={spamMessage}
								onChange={(spamMessage) => props.setAttributes({ spamMessage })}
							/>
							<TextareaControl
								label={__("Error Message", "forms-gutenberg")}
								value={errorMessage}
								onChange={(errorMessage) =>
									props.setAttributes({ errorMessage })
								}
							/>
						</Fragment>
					)}
				</div>
				{successType === "message" && (
					<div className="cwp-option">
						<PanelRow>
							<h3>{__("Hide Form On Success", "forms-gutenberg")}</h3>
							<FormToggle
								checked={hideFormOnSuccess}
								onChange={() =>
									props.setAttributes({ hideFormOnSuccess: !hideFormOnSuccess })
								}
							/>
						</PanelRow>
					</div>
				)}
			</PanelBody>

			{actions.includes("Email Notification") && (
				<PanelBody title={__("Email Notification", "forms-gutenberg")}>
					<TemplateBuilder clientId={props.clientId} data={props} />
				</PanelBody>
			)}

			<PanelBody title={__("Form Action", "forms-gutenberg")}>
				<FormTokenField
					value={actions}
					onChange={handleActions}
					suggestions={get_form_actions()}
				/>
				<TextControl
					label={__("Custom Form Action Name", "forms-gutenberg")}
					value={customAction}
					onChange={(customAction) => props.setAttributes({ customAction })}
				/>
			</PanelBody>

			{!isEmpty(get_spam_protectors()) && (
				<PanelBody title={__("Spam Protection", "forms-gutenberg")}>
					{get_spam_protectors().map((protection) => {
						const isEnabled = hasObject(spamProtections, protection);

						return (
							<div className="cwp-option">
								<PanelRow>
									<h3>{protection.title}</h3>
									<FormToggle
										value={isEnabled}
										checked={isEnabled}
										onChange={() => handleProtection(protection)}
									/>
								</PanelRow>
							</div>
						);
					})}
				</PanelBody>
			)}

			<PanelBody initialOpen={false} title={__("Messages", "forms-gutenberg")}>
				<div className="cwp-option">
					<p>
						<Icon icon="info" />{" "}
						{__(
							"You can edit validations messages used for various field types here. Use {{ value }} to insert field value.",
							"forms-gutenberg"
						)}
					</p>
				</div>
				<MappedMessages val={messages} onChange={handleMessagesChange} />
			</PanelBody>
			<Integrations data={props} clientId={props.clientId} />
		</InspectorControls>
	);
}

export default Inspector;
