import React from "react";
import { isEmpty } from "lodash";
import { strip_tags } from "../../block/misc/helper";

function save(props) {
	const {
		message,
		isRequired,
		label,
		id,
		height,
		requiredLabel,
		messages: { empty, invalid },
		pattern
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
		empty
	});
	let getPattern = () => {
		return isEmpty(pattern) ? {} : { pattern };
	};
	return (
		<div className="cwp-message cwp-field">
			<div className="cwp-field-set">
				{!isEmpty(label) && (
					<label
						for={id}
						dangerouslySetInnerHTML={{ __html: getLabel() }}
					></label>
				)}
				<textarea
					id={id}
					aria-label={strip_tags(label)}
					style={{ height: height }}
					data-cwp-field
					name={id}
					title={invalid}
					required={isRequired}
					data-errors={errors}
					data-rule="false"
					{...getPattern()}
					placeholder={message}
				/>
			</div>
		</div>
	);
}

export default save;
