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
		phone,
		isRequired,
		label,
		id,
		requiredLabel,
		messages: { empty, invalid },
		pattern,
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

	let errors = JSON.stringify({
		mismatch: invalid,
		empty,
	});

	let getPattern = () => {
		return isEmpty(pattern) ? {} : { pattern };
	};

	const getCondition = () => {
		if (props.attributes.enableCondition && !isEmpty(condition.field)) {
			// verifying the condition
			return {
				"data-condition": stringifyCondition(condition),
			};
		}

		return {};
	};

	return (
		<div className="cwp-phone cwp-field" {...getCondition()}>
			<div className="cwp-field-set">
				{!isEmpty(label) && (
					<label
						for={id}
						dangerouslySetInnerHTML={{ __html: getLabel() }}
					></label>
				)}
				<input
					id={id}
					aria-label={strip_tags(label)}
					data-cwp-field
					data-errors={errors}
					name={id}
					type="tel"
					data-phone="true"
					data-rule="false"
					placeholder={phone}
					{...getPattern()}
					required={isRequired}
				/>
			</div>
		</div>
	);
}

export default save;
