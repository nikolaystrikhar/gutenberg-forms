import React from "react";
import { isEmpty } from "lodash";

function save(props) {
	const {
		number,
		isRequired,
		label,
		id,
		field_name,
		isRange,
		rangeMax,
		rangeMin
	} = props.attributes;
	const getLabel = () => {
		const { label, isRequired } = props.attributes;

		let required = "<span>(Required)</span>";

		let required_label = label + " " + required;

		if (isRequired) return required_label;

		return label;
	};

	return (
		<div className="cwp-number cwp-field">
			<div className="cwp-field-set">
				{!isEmpty(label) && (
					<label dangerouslySetInnerHTML={{ __html: getLabel() }}></label>
				)}
				{isRange ? (
					<input
						data-cwp-field
						name={id}
						value={number}
						max={rangeMax}
						data-required={isRequired}
						min={rangeMin}
						data-default={number}
						data-rule="false"
						type="range"
					/>
				) : (
					<input
						data-cwp-field
						name={id}
						data-rule="false"
						data-default={number}
						value={number}
						data-required={isRequired}
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
