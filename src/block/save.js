import React, { Fragment } from "react";
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
		recaptcha: { siteKey }
	} = props.attributes;

	const captcha_p = `

			var onloadCallback = function(token) {
				grecaptcha.render('${id + "g-render"}', {
				  'sitekey' : '${siteKey}'
				});
			  };

	`;

	return (
		<Fragment>
			<div className="cwp-form">
				<form data-parsley-validate method="POST">
					<InnerBlocks.Content />
					{recaptcha.enable && (
						<div
							class="g-recaptcha"
							id={id + "g-render"}
							data-sitekey={siteKey}
						></div>
					)}
					<div className={`cwp-submit ${alignment}`}>
						<button
							name="submit"
							value={id}
							type="submit"
							style={{
								backgroundColor: buttonSetting.backgroundColor,
								color: buttonSetting.color
							}}
							className="cwp-submit-btn"
							dangerouslySetInnerHTML={{ __html: submitLabel }}
						></button>
					</div>
				</form>
				{successType === "message" && (
					<div id={id} className="cwp-success cwp-hidden">
						{successMessage}
					</div>
				)}
				<div id={id + "-captcha"} className="cwp-danger-captcha cwp-hidden">
					Incorrect Captcha!
				</div>
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
		</Fragment>
	);
}

export default save;
