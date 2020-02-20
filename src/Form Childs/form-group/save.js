import React from "react";
import { isEmpty } from "lodash";
import { stringifyCondition } from "../../block/functions";
const { InnerBlocks } = wp.blockEditor;

function save(props) {
	const { styling, label, condition } = props.attributes;

	const getCondition = () => {
		if (!isEmpty(condition.field)) {
			//verifying the condition
			return {
				"data-condition": stringifyCondition(condition)
			};
		}

		return {};
	};
	return (
		<fieldset style={styling} className="cwp-form-group" {...getCondition()}>
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
