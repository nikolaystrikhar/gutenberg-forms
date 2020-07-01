import React from "react";
import { InnerBlocks } from "@wordpress/block-editor";
import { isEmpty } from "lodash";

function save(props) {
	const { label } = props.attributes;

	const stepLabel = isEmpty(label) ? "Form Step" : label;

	return (
		<fieldset className="cwp-form-step" data-label={stepLabel}>
			<InnerBlocks.Content />
		</fieldset>
	);
}

export default save;
