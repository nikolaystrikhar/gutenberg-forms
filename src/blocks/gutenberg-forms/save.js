import React from "react";
import { getThemeStyling } from "../../block/misc/helper";
import { isEmpty } from "lodash";
const { InnerBlocks } = wp.blockEditor;

function save(props) {
	const {
		submitLabel,
		buttonSetting: { alignment },
		buttonSetting,
		id,
		successType,
		successMessage,
		recaptcha,
		theme,
		recaptcha: { siteKey },
		formType,
		encryption,
		hideFormOnSuccess,
		formLabel
	} = props.attributes;

	const captcha_p = `

			var onloadCallback = function(token) {
				grecaptcha.render('${id + "g-render"}', {
				  'sitekey' : '${siteKey}'
				});
			  };

	`;
	const formId = id && "form-".concat(id.split("-")[1]);

	const getEncryption = () => {
		if (!isEmpty(encryption)) {
			return {
				enctype: encryption
			}
		}

		return {};
	}

	return (
		<div>
			<div className="cwp-form" data-formtype={formType} id={formId}>
				<form method="POST" id={id} {...getEncryption()} data-formid={id}>
					<InnerBlocks.Content />
					{recaptcha.enable && (
						<div
							class="g-recaptcha"
							id={id + "g-render"}
							data-sitekey={siteKey}
						></div>
					)}
					<div style={{ display: 'none' }}>
						<input
							type="hidden"
							name="gf_form_label"
							value={formLabel}
						/>
						<input
							type="hidden"
							name="gf_form_id"
							value={formId}
						/>
					</div>
					{!buttonSetting.disable && (
						<div className={`cwp-submit ${alignment}`}>
							<button
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
							{
								hideFormOnSuccess && <div className="cwp-add_another_submission">
									<button>Another Submission</button>
								</div>
							}
						</div>
					</div>
				)}
				{recaptcha.enable && (
					<div id={id + "-captcha"} className="cwp-danger-captcha cwp-hidden">
						Incorrect Captcha!
					</div>
				)}
			</div>
			{recaptcha.enable && (
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
						src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
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
