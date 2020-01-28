import React from "react";
import { isEmpty } from "lodash";

function save(props) {
	const { email, isRequired, label, id } = props.attributes;

	const getLabel = () => {
		const { label, isRequired } = props.attributes;

		let required = "<span>(Required)</span>";

		let required_label = label + " " + required;

		if (isRequired) return required_label;

		return label;
	};

	return (
		<div className="cwp-email cwp-field">
			<div className="cwp-field-set">
				{!isEmpty(label) && (
					<label dangerouslySetInnerHTML={{ __html: getLabel() }}></label>
				)}
				<input
					name={id}
					type="email"
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
