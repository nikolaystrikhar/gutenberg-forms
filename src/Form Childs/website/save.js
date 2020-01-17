import React from "react";
import { isEmpty } from "lodash";

function save(props) {
	const { website, isRequired, label, id } = props.attributes;

	const getLabel = () => {
		const { label, isRequired } = props.attributes;

		let required = "<span>(Required)</span>";

		let required_label = label + " " + required;

		if (isRequired) return required_label;

		return label;
	};

	return (
		<div className="cwp-website cwp-field">
			<div className="cwp-field-set">
				{!isEmpty(label) && (
					<label dangerouslySetInnerHTML={{ __html: getLabel() }}></label>
				)}
				<input
					data-cwp-field
					data-required={isRequired}
					name={id}
					type="url"
					placeholder={website}
				/>
			</div>
		</div>
	);
}

export default save;
