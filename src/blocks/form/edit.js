import React, { useEffect, Fragment } from "react";
import Inspector from "./Inspector";
import Introduction from "./components/introduction";
import { isEmpty } from "lodash";
import { getFormTemplates, detect_similar_forms } from "../../block/functions/index";
import { getThemeStyling } from "../../block/misc/helper";
import { withDispatch } from "@wordpress/data";
import { InnerBlocks, RichText, useBlockProps } from "@wordpress/block-editor";

const { compose } = wp.compose;
const { __ } = wp.i18n;

function edit(props) {
	const blockProps = useBlockProps();

	const {
		submitLabel,
		buttonSetting: { alignment },
		buttonSetting,
		templateBuilder,
		id,
		theme,
		formType,
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

	// All blocks except the form blocks.
	const ALLOWED_BLOCKS = wp.blocks.getBlockTypes()
		.map(block => block.name)
		.filter(
			blockName => ['cwp/block-gutenberg-forms', 'cwp/reusable-form'].indexOf(blockName) === -1
		);

	return [
		isEmpty(formType) ? null : <Inspector data={props} />,
		null,
		<Fragment {...blockProps}>
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
							allowedBlocks={ALLOWED_BLOCKS}
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
						<div className="cwp-button-block-appender">
							<InnerBlocks.ButtonBlockAppender />
						</div>
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
