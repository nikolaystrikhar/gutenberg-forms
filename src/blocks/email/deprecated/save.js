/**
 * ! Deprecated Save Version
 */

import React from "react";
import { isEmpty } from "lodash";
import { strip_tags } from "../../../block/misc/helper";
import { stringifyCondition } from "../../../block/functions";

function save(props) {
	const {
		email,
		isRequired,
		label,
		id,
		requiredLabel,
		messages,
		messages: { invalidEmail, empty },
		condition,
		enableCondition,
		adminId,
	} = props.attributes;

	const getLabel = () => {
		const { label, isRequired } = props.attributes;

		const required = !isEmpty(requiredLabel)
			? `<abbr title="required" aria-label="required">${requiredLabel}</abbr>`
			: "";

		const required_label = label + " " + required;

		if (isRequired) {
			return required_label;
		}

		return label;
	};

	const errors = JSON.stringify({
		mismatch: invalidEmail,
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
		<div className="cwp-email cwp-field" {...getCondition()}>
			<div className="cwp-field-set">
				{!isEmpty(label) && (
					<label
						htmlFor={id}
						dangerouslySetInnerHTML={{ __html: getLabel() }}
					></label>
				)}
				<input
					id={id}
					aria-label={strip_tags(label)}
					name={id}
					type="email"
					data-errors={errors}
					data-cwp-field
					data-validation="email"
					data-parsley-type="email"
					required={isRequired}
					placeholder={email}
				/>
			</div>
		</div>
	);
}

export default save;
