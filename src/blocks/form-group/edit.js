import React, { Fragment } from "react";
import Inspector from "./Inspector";
import { Notice } from "@wordpress/components";
import { isChildFieldsRequired } from "../../block/functions";
const { InnerBlocks, RichText } = wp.blockEditor;
const { __ } = wp.i18n;


function edit(props) {
	const { styling, label, enableCondition } = props.attributes;

	const handleLabel = label => {
		props.setAttributes({ label });
	};

	const groupStyling = {
		border: `${styling.borderWidth}px solid ${styling.borderColor}`,
		...styling
	}

	return [
		!!props.isSelected && <Inspector data={props} />,
		null,
		<Fragment>
			{isChildFieldsRequired(props.clientId) && enableCondition && (
				<Notice status="error" isDismissible={false}>
					{
						__("Do not have a required fields inside a conditional group.", "forms-gutenberg")
					}
				</Notice>
			)}
			<fieldset style={groupStyling} className="cwp-form-group">
				<RichText placeholder={__("Add a label", "forms-gutenberg")} tag="legend" onChange={handleLabel} value={label} />
				<div className="cwp-group-fields">
					<InnerBlocks />
				</div>
			</fieldset>
		</Fragment>
	];
}

export default edit;
