/**
 *
 * ! DEPRECATED SAVE VERSION
 *
 */

import React from "react";
import { isEmpty } from "lodash";
import { stringifyCondition } from "../../../block/functions";

function save(props) {
	const {
		isRequired,
		options,
		label,
		id,
		requiredLabel,
		messages,
		messages: { empty },
		condition,
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
	const getCondition = () => {
		if (props.attributes.enableCondition && !isEmpty(condition.field)) {
			//verifying the condition
			return {
				"data-condition": stringifyCondition(condition),
			};
		}

		return {};
	};
	const errors = JSON.stringify({
		empty,
	});

	return (
		<div className="cwp-select cwp-field" {...getCondition()}>
			<div className="cwp-select-set">
				{!isEmpty(label) && (
					<label dangerouslySetInnerHTML={{ __html: getLabel() }}></label>
				)}
				<select
					name={id}
					id={id}
					data-rule="false"
					value={label}
					data-cwp-field
					data-errors={errors}
					required={isRequired}
				>
					<option value="" disabled selected>
						Select your option
					</option>
					{options.map((s, index) => {
						return <option value={s.label}>{s.label}</option>;
					})}
				</select>
			</div>
		</div>
	);
}

export default save;
