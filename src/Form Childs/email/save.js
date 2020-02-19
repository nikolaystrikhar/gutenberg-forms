import React from "react";
import { isEmpty } from "lodash";
import { strip_tags } from "../../block/misc/helper";
import { stringifyCondition } from "../../block/functions";

function save(props) {
	const {
		email,
		isRequired,
		label,
		id,
		requiredLabel,
		messages,
		messages: { invalidEmail, empty },
		condition
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
		mismatch: invalidEmail,
		empty
	});

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
		<div className="cwp-email cwp-field" {...getCondition()}>
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
