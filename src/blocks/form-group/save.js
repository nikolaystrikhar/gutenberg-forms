import React from "react";
import { isEmpty } from "lodash";
import { stringifyCondition } from "../../block/functions";
const { InnerBlocks } = wp.blockEditor;

function save(props) {
	const { styling, label, condition, enableCondition } = props.attributes;

	const groupStyling = {
		border: `${styling.borderWidth}px solid ${styling.borderColor}`,
		...styling
	}


	const getCondition = () => {
		if (enableCondition) {
			//verifying the condition
			return {
				"data-condition": stringifyCondition(condition)
			};
		}

		return {};
	};
	return (
		<fieldset style={groupStyling} className="cwp-form-group" {...getCondition()}>
			{!isEmpty(label) && (
				<legend dangerouslySetInnerHTML={{ __html: label }}></legend>
			)}
			<div className="cwp-group-fields">
				<InnerBlocks.Content />
			</div>
		</fieldset>
	);
}

export default save;
