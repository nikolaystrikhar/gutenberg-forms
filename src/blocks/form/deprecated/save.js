/**
 * ! DEPRECATED SAVE VERSION
 */

import React from "react";
import { getThemeStyling } from "../../../block/misc/helper";
import { isEmpty, get } from "lodash";
import {
	hasProtection,
	getProtection,
	get_submission_message,
} from "../../../block/functions";
const { InnerBlocks } = wp.blockEditor;

function save(props) {
	const {
		submitLabel,
		buttonSetting: { alignment },
		buttonSetting,
		id,
		successType,
		successMessage,
		theme,
		formType,
		encryption,
		hideFormOnSuccess,
		formLabel,
		spamProtections,
		buttonStyling,
		messages,
		spamMessage,
		errorMessage,
	} = props.attributes;

	const recaptchaEnable = hasProtection("ReCaptcha v2", spamProtections);
	const recaptcha = getProtection("ReCaptcha v2", spamProtections);

	const { error, spam } = get_submission_message();

	const captcha_p = `
			var onloadCallback = function(token) {
				grecaptcha.render('${id + "g-render"}', {
				  'sitekey' : '${recaptchaEnable && recaptcha.fields.site_key.value}'
				});
			  };
	`;
	const formId = id && "form-".concat(id.split("-")[1]);

	const getEncryption = () => {
		if (!isEmpty(encryption)) {
			return {
				enctype: encryption,
			};
		}

		return {};
	};

	return (
		<div>
			<div className="cwp-form" data-formtype={formType} id={formId}>
				<form method="POST" id={id} {...getEncryption()} data-formid={id}>
					<InnerBlocks.Content />
					{recaptchaEnable && (
						<div
							class="g-recaptcha"
							id={id + "g-render"}
							data-sitekey={recaptchaEnable && recaptcha.fields.site_key.value}
						></div>
					)}
					<div style={{ display: "none" }}>
						<input type="hidden" name="gf_form_label" value={formLabel} />
						<input type="hidden" name="gf_form_id" value={formId} />
					</div>
					{!buttonSetting.disable && (
						<div className={`cwp-submit ${alignment}`}>
							<button
								style={buttonStyling}
								name="submit"
								value={id}
								type="submit"
								className="cwp-submit-btn cwp-default-submit-btn"
								dangerouslySetInnerHTML={{ __html: submitLabel }}
							></button>
						</div>
					)}
				</form>
				{successType === "message" && (
					<div id={id} className="cwp-success cwp-hidden">
						<div className="wrapper">
							<span>{successMessage}</span>
							{hideFormOnSuccess && (
								<div className="cwp-add_another_submission">
									<button>Another Submission</button>
								</div>
							)}
						</div>
					</div>
				)}

				<div data-id={id} className="cwp-hidden spam">
					{spamMessage}
				</div>
				<div data-id={id} className="cwp-hidden error">
					{errorMessage}
				</div>

				{recaptchaEnable && (
					<div id={id + "-captcha"} className="cwp-danger-captcha cwp-hidden">
						Incorrect Captcha!
					</div>
				)}
			</div>
			{recaptchaEnable && (
				<div id="cwp-protected">
					<script
						src="https://www.google.com/recaptcha/api.js"
						async
						defer
					></script>
					<script
						src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit"
						async
						defer
					></script>
					<script
						src={`https://www.google.com/recaptcha/api.js?render=${
							recaptchaEnable && recaptcha.fields.site_key.value
						}`}
					></script>
					<script dangerouslySetInnerHTML={{ __html: captcha_p }}></script>
				</div>
			)}
			<div
				dangerouslySetInnerHTML={{ __html: getThemeStyling(theme, formId) }}
			></div>
		</div>
	);
}

export default save;
