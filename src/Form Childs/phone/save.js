import React from "react";
import { isEmpty } from "lodash";

function save(props) {
	const { phone, isRequired, label, id } = props.attributes;

	const getLabel = () => {
		const { label, isRequired } = props.attributes;

		let required = "<span>(Required)</span>";

		let required_label = label + " " + required;

		if (isRequired) return required_label;

		return label;
	};

	return (
		<div className="cwp-phone cwp-field">
			<div className="cwp-field-set">
				{!isEmpty(label) && (
					<label dangerouslySetInnerHTML={{ __html: getLabel() }}></label>
				)}
				<input
					data-cwp-field
					name={id}
					data-phone="true"
					data-rule="false"
					placeholder={phone}
					data-required={isRequired}
				/>
			</div>
		</div>
	);
}

export default save;
