import React from "react";
import { isEmpty } from "lodash";

function save(props) {
	const { isRequired, options, label } = props.attributes;

	const getLabel = () => {
		const { label, isRequired } = props.attributes;

		let required = "<span>(Required)</span>";

		let required_label = label + " " + required;

		if (isRequired) return required_label;

		return label;
	};

	return (
		<div className="cwp-checkbox cwp-field">
			<div className="cwp-checkbox-set">
				{!isEmpty(label) && (
					<label dangerouslySetInnerHTML={{ __html: getLabel() }}></label>
				)}
				{options.map((checkbox, index) => {
					return (
						<div className="cwp-checkbox-option">
							<input checked={checkbox.checked} type="checkbox" />
							<label>{checkbox.label}</label>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default save;
