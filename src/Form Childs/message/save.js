import React from "react";
import { isEmpty } from "lodash";

function save(props) {
	const { message, isRequired, label, id, height } = props.attributes;

	const getLabel = () => {
		const { label, isRequired } = props.attributes;

		let required = "<span>(Required)</span>";

		let required_label = label + " " + required;

		if (isRequired) return required_label;

		return label;
	};

	return (
		<div className="cwp-message cwp-field">
			<div className="cwp-field-set">
				{!isEmpty(label) && (
					<label dangerouslySetInnerHTML={{ __html: getLabel() }}></label>
				)}
				<textarea
					style={{ height: height }}
					data-cwp-field
					name={id}
					required={isRequired}
					data-rule="false"
					placeholder={message}
				/>
			</div>
		</div>
	);
}

export default save;
