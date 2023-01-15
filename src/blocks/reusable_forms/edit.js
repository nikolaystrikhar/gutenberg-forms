import React from "react";
import Introduction from "./components/introduction";
import { isEmpty, get } from "lodash";
import { SelectControl, Button, PanelBody } from "@wordpress/components";
import { getPostUrl } from "../../block/functions";
const { InspectorControls } = wp.blockEditor;
const { __ } = wp.i18n;

function edit(props) {
	const savedForms = get(window, "cwpGlobal.cwp-cpt-forms");

	let formIdTitleHash = [];
	[...savedForms].map((form) => {
		formIdTitleHash[ get(form, "ID") ] = get(form, "post_title");
	});

	const {
		setAttributes,
		attributes: { formId },
		isSelected,
	} = props;

	const shouldIntroduce = isEmpty(formId); // render the introduction if there is no form attributes to preview  useEffect( () => {
	const formTitle = get(formIdTitleHash, formId, '');

	return [
		!!isSelected && !shouldIntroduce && (
			<InspectorControls>
				<PanelBody title={__("General", "forms-gutenberg")} initialOpen={true}>
					<SelectControl
						label={__("Select Form", "forms-gutenberg")}
						className="cwp-reusable-select"
						value={formId}
						onChange={(form) => setAttributes({ formId: form })}
					/>
					<div className="cwp-reusable-edit-url">
						<Button isLink href={getPostUrl(formId)} target="__blanks">
							{__("Edit Form", "forms-gutenberg")}
						</Button>
					</div>
				</PanelBody>
			</InspectorControls>
		),
		null,
		<div className="cwp-gutenberg-forms-reusable">
			{shouldIntroduce
				? <Introduction value={formId} onSelect={formId => setAttributes({ formId })} />
				: (
					<div className="cwp-rendered-content">
						<div className={`cwp-gutenberg-forms-reusable`}>
							{formTitle.length > 0
								? <p>{__('Here will be shown a Gutenberg Form called', 'forms-gutenberg')} "{formTitle}".</p>
								: <p>{__('This Gutenberg Form was deleted and will not be shown. You may want to delete this block or restore a form if possible.', 'forms-gutenberg')} (ID {formId})</p>
							}
						</div>
					</div>
				)
			}
		</div>,
	];
}

export default edit;
