import React, { Fragment } from "react";
import { isEmpty } from "lodash";
import { strip_tags } from "../../block/misc/helper";

function save(props) {
	const {
		number,
		isRequired,
		label,
		id,
		field_name,
		isRange,
		rangeMax,
		rangeMin,
		requiredLabel,
		messages,
		messages: { invalid, empty },
		steps
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

	return (
		<div className="cwp-number cwp-field">
			<div className="cwp-field-set">
				{!isEmpty(label) && (
					<label
						for={id}
						dangerouslySetInnerHTML={{ __html: getLabel() }}
					></label>
				)}
				{isRange ? (
					<div className="cwp-range-set">
						<input
							id={id}
							value={number}
							max={rangeMax}
							required={isRequired}
							min={rangeMin}
							data-default={number}
							data-rule="false"
							type="range"
							data-cwp-field
							step={steps}
						/>
						<input
							id={id}
							aria-label={strip_tags(label)}
							data-cwp-field
							data-errors={errors}
							name={id}
							step={steps}
							data-rule="false"
							data-default={number}
							value={number}
							required={isRequired}
							max={rangeMax}
							min={rangeMin}
							type="number"
						/>
					</div>
				) : (
						<input
							id={id}
							aria-label={strip_tags(label)}
							data-cwp-field
							data-errors={errors}
							name={id}
							data-rule="false"
							data-default={number}
							value={number}
							required={isRequired}
							step={steps}
							max={rangeMax}
							min={rangeMin}
							type="number"
						/>
					)}
			</div>
		</div>
	);
}

export default save;
