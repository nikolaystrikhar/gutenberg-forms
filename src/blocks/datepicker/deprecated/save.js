/**
 *
 * ! DEPRECATED SAVE VERSION
 *
 */

import React from "react";
import { isEmpty } from "lodash";
import { strip_tags } from "../../../block/misc/helper";
import { stringifyCondition } from "../../../block/functions";

function save(props) {
	const {
		placeholder,
		isRequired,
		label,
		id,
		requiredLabel,
		type,
		messages: { empty },
		format,
		condition,
		enableCondition,
	} = props.attributes;

	const getLabel = () => {
		const { label, isRequired } = props.attributes;
		let required = !isEmpty(requiredLabel)
			? `<abbr title="required" aria-label="required">${requiredLabel}</abbr>`
			: "";
		let required_label = label + " " + required;

		if (isRequired) return required_label;

		return label;
	};

	let getFieldType = () => {
		switch (type) {
			case "both":
				return "datetime-local";
			case "time":
				return "time";
			case "date":
				return "date";
		}
	};

	let errors = JSON.stringify({
		empty,
	});

	const getCondition = () => {
		if (!isEmpty(condition.field) && enableCondition) {
			//verifying the condition
			return {
				"data-condition": stringifyCondition(condition),
			};
		}

		return {};
	};

	return (
		<div className="cwp-datepicker cwp-field" {...getCondition()}>
			<div className="cwp-field-set" data-required={isRequired}>
				{!isEmpty(label) && (
					<label
						for={id}
						dangerouslySetInnerHTML={{ __html: getLabel() }}
					></label>
				)}
				<input
					id={id}
					type="text"
					aria-label={strip_tags(label)}
					name={id}
					readOnly
					required={isRequired}
					data-cwp-field
					data-rule="false"
					data-format={format}
					data-errors={errors}
					data-validation="date"
					data-validation-format="dd/mm/yyyy"
					data-language="en"
					value={placeholder}
				/>
			</div>
		</div>
	);
}

export default save;
