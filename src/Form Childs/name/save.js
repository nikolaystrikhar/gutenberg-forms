import React from "react";
import { isEmpty } from "lodash";

function save(props) {
	const { name, isRequired, label } = props.attributes;

	const getLabel = () => {
		const { label, isRequired } = props.attributes;

		let required = "<span>(Required)</span>";

		let required_label = label + " " + required;

		if (isRequired) return required_label;

		return label;
	};

	return (
		<div className="cwp-name cwp-field">
			<div className="cwp-field-set" data-required={isRequired}>
				{!isEmpty(label) && (
					<label dangerouslySetInnerHTML={{ __html: getLabel() }}></label>
				)}
				<input placeholder={name} />
			</div>
		</div>
	);
}

export default save;
