import React from "react";
import { isEmpty } from "lodash";
import { strip_tags } from "../../block/misc/helper";

function save(props) {
	const { placeholder, isRequired, label, id } = props.attributes;

	const getLabel = () => {
		const { label, isRequired } = props.attributes;

		let required = "<span>(Required)</span>";

		let required_label = label + " " + required;

		if (isRequired) return required_label;

		return label;
	};

	return (
		<div className="cwp-datepicker cwp-field">
			<div className="cwp-field-set" data-required={isRequired}>
				{!isEmpty(label) && (
					<label dangerouslySetInnerHTML={{ __html: getLabel() }}></label>
				)}
				<input
					aria-label={strip_tags(label)}
					readOnly
					name={id}
					required={isRequired}
					data-cwp-field
					data-rule="false"
					data-validation="date"
					data-validation-format="dd/mm/yyyy"
					data-language="en"
					placeholder={placeholder}
				/>
			</div>
		</div>
	);
}

export default save;
