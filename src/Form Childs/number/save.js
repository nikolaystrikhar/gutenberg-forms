import React from "react";
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
		requiredLabel
	} = props.attributes;
	const getLabel = () => {
		const { label, isRequired } = props.attributes;

		let required = `<abbr title="required" aria-label="required">${requiredLabel}</abbr>`;

		let required_label = label + " " + required;

		if (isRequired) return required_label;

		return label;
	};

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
					<input
						id={id}
						data-cwp-field
						name={id}
						value={number}
						max={rangeMax}
						required={isRequired}
						min={rangeMin}
						data-default={number}
						data-rule="false"
						type="range"
					/>
				) : (
					<input
						id={id}
						aria-label={strip_tags(label)}
						data-cwp-field
						data-parsley-type="integer"
						name={id}
						data-rule="false"
						data-default={number}
						value={number}
						required={isRequired}
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
