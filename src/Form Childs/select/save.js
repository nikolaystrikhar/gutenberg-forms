import React from "react";
import { isEmpty } from "lodash";

function save(props) {
	const { isRequired, options, label, id } = props.attributes;

	const getLabel = () => {
		const { label, isRequired } = props.attributes;

		let required = "<span>(Required)</span>";

		let required_label = label + " " + required;

		if (isRequired) return required_label;

		return label;
	};

	return (
		<div className="cwp-select cwp-field">
			<div className="cwp-select-set">
				{!isEmpty(label) && (
					<label dangerouslySetInnerHTML={{ __html: getLabel() }}></label>
				)}
				<select
					name={id}
					type="select"
					data-rule="false"
					value={label}
					data-cwp-field
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
