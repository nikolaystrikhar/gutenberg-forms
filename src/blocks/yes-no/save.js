import React from "react";
import { isEmpty } from "lodash";
import { strip_tags } from "../../block/misc/helper";

function save(props) {
	const { yes_no, isRequired, label, id, requiredLabel } = props.attributes;

	const getLabel = () => {
		const { label, isRequired } = props.attributes;
		let required = !isEmpty(requiredLabel)
			? `<abbr title="required" aria-label="required">${requiredLabel}</abbr>`
			: "";
		let required_label = label + " " + required;

		if (isRequired) return required_label;

		return label;
	};

	return (
		<div className="cwp-yes-no cwp-field">
			<div className="cwp-field-set">
				{!isEmpty(label) && (
					<label
						for={id}
						dangerouslySetInnerHTML={{ __html: getLabel() }}
					></label>
				)}
				<label className="cwp-switch">
					<input
						name={id}
						id={id}
						type="hidden"
						value={yes_no ? "yes" : "no"}
						readOnly
					/>
					<input
						name={id}
						required={isRequired}
						data-cwp-field
						aria-label={strip_tags(label)}
						type="checkbox"
						checked={yes_no}
					/>

					<span className="cwp-slider"></span>
				</label>
			</div>
		</div>
	);
}

export default save;
