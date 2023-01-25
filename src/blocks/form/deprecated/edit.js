/**
 * ! DEPRECATED EDIT VERSION
 */

import React, { useEffect, Fragment } from "react";
import Inspector from "../Inspector";
import Introduction from "../components/introduction";
import { isEmpty, get } from "lodash";
import {
	getFormTemplates,
	detect_similar_forms,
	getGlobalMessages,
	get_submission_message,
} from "../../../block/functions/index";
import { getThemeStyling } from "../../../block/misc/helper";
import { withDispatch } from "@wordpress/data";
import { InnerBlocks, RichText } from "@wordpress/block-editor";

const { compose } = wp.compose;
const { __ } = wp.i18n;

function edit(props) {
	const {
		submitLabel,
		buttonSetting: { alignment },
		buttonSetting,
		templateBuilder,
		template,
		id,
		theme,
		formType,
		cpt,
		formLabel,
		integrations,
		buttonStyling,
	} = props.attributes;

	const formId = id && "form-".concat(id.split("-")[1]);

	useEffect(() => {
		if (id === "" || detect_similar_forms(props.clientId)) {
			props.setAttributes({ id: "submit-" + props.clientId });
		}
	}, []);

	const handleButtonLabel = (label) => {
		props.setAttributes({ submitLabel: label });
	};

	const showEditor = !templateBuilder ? "cwp-hideEditor" : "cwp-showEditor";

	const handleTypeChange = (type) => {
		const buttonSetting = {
			...buttonSetting,
			disable: type === "multiStep" ? true : false,
		};
		props.setAttributes({ formType: type, buttonSetting });
	};

	return [
		isEmpty(formType) ? null : <Inspector data={props} />,
		null,
		<Fragment>
			{isEmpty(formType) ? (
				<Introduction onSelect={handleTypeChange} data={props} />
			) : (
				<Fragment>
					<div
						id={formId}
						className={`cwp-form cwp-form_main ${props.className} ${showEditor}`}
					>
						<InnerBlocks
							template={getFormTemplates(formType)}
							templateLock={false}
							renderAppender={() => null}
						/>
						{!buttonSetting.disable && (
							<div className={`cwp-submit ${alignment}`}>
								<button
									style={buttonStyling}
									className="cwp-submit-btn cwp-default-submit-btn"
								>
									<RichText
										placeholder={__("Add a label", "forms-gutenberg")}
										tag="span"
										value={submitLabel}
										onChange={handleButtonLabel}
									/>
								</button>
							</div>
						)}
					</div>
					<div
						dangerouslySetInnerHTML={{ __html: getThemeStyling(theme, formId) }}
					></div>
				</Fragment>
			)}
		</Fragment>,
	];
}

// enforcing template validity on custom post types
const enforceTemplateValidity = withDispatch((dispatch, props) => {
	dispatch("core/block-editor").setTemplateValidity(true);
});

export default compose(enforceTemplateValidity)(edit);
