import React, { Fragment } from "react";
import Inspector from "./Inspector";
import { Notice } from "@wordpress/components";
import { isChildFieldsRequired } from "../../block/functions";
const { InnerBlocks, RichText } = wp.blockEditor;

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
					Do not have a required fields inside a conditional group.
				</Notice>
			)}
			<fieldset style={groupStyling} className="cwp-form-group">
				<RichText tag="legend" onChange={handleLabel} value={label} />
				<div className="cwp-group-fields">
					<InnerBlocks />
				</div>
			</fieldset>
		</Fragment>
	];
}

export default edit;
