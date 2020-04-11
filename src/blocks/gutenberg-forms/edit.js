import React, { useEffect, Fragment } from "react";
import Inspector from "./Inspector";
import TemplateBuilder from "./components/templateBuilder";
import Introduction from "./components/introduction";
import { isEmpty, get } from "lodash";
import { getFormTemplates, detect_similar_forms } from "../../block/functions/index";
import { getThemeStyling } from "../../block/misc/helper";
import { TEXT_DOMAIN } from "../../block/constants";
import { withDispatch } from "@wordpress/data";

const { InnerBlocks, RichText, BlockControls, BlockIcon } = wp.blockEditor;
const { Button, Toolbar, Tooltip } = wp.components;

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
		formLabel
	} = props.attributes;

	const formId = id && "form-".concat(id.split("-")[1]);

	useEffect(() => {


		if (id === '' || detect_similar_forms(props.clientId)) {
			props.setAttributes({ id: "submit-" + props.clientId });
		}

		if (formLabel === "") {
			props.setAttributes({ formLabel: "Gutenberg Form" })
		}

	}, []);


	const handleButtonLabel = label => {
		props.setAttributes({ submitLabel: label });
	};

	const showEditor = !templateBuilder ? "cwp-hideEditor" : "cwp-showEditor";

	const handleTypeChange = (type) => {

		const buttonSetting = {
			...buttonSetting,
			disable: type === 'multiStep' ? true : false
		}
		props.setAttributes({ formType: type, buttonSetting });
	}

	return [
		isEmpty(formType) ? null : <Inspector data={props} />,
		<BlockControls>
			<Toolbar>
				<Tooltip text={__(templateBuilder ? 'Form Builder' : "Email Builder", TEXT_DOMAIN)}>
					<Button
						onClick={() => {
							props.setAttributes({ templateBuilder: !templateBuilder });
						}}
					>
						<BlockIcon
							icon={templateBuilder ? "feedback" : "email"}
							showColors
						/>
					</Button>
				</Tooltip>
			</Toolbar>
		</BlockControls>,
		<Fragment>
			{
				isEmpty(formType) ?
					<Introduction onSelect={handleTypeChange} data={props} /> : <Fragment>
						<div
							id={formId}
							className={`cwp-form cwp-form_main ${props.className} ${showEditor}`}
						>
							<InnerBlocks
								template={getFormTemplates(formType)}
								templateLock={false}
								renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
							/>
							{!buttonSetting.disable && (
								<div className={`cwp-submit ${alignment}`}>
									<button className="cwp-submit-btn cwp-default-submit-btn">
										<RichText
											tag="span"
											value={submitLabel}
											onChange={handleButtonLabel}
										/>
									</button>
								</div>
							)}
						</div>
						<div className={`cwp-form ${showEditor}`}>
							<div className="cwp-editor">
								<TemplateBuilder clientId={props.clientId} data={props} />
							</div>
						</div>
						<div
							dangerouslySetInnerHTML={{ __html: getThemeStyling(theme, formId) }}
						></div>
					</Fragment>
			}
		</Fragment>
	];
}

// enforcing template validity on custom post types
const enforceTemplateValidity = withDispatch((dispatch, props) => {
	dispatch('core/block-editor').setTemplateValidity(true);
});

export default compose(enforceTemplateValidity)(edit);
