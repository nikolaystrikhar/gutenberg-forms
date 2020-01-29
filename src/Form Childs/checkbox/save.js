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

	const getRequired = index => {
		if (isRequired && index === 0) {
			return {
				"data-parsley-mincheck": "1"
			};
		} else {
			return {};
		}
	};

	return (
		<div className="cwp-checkbox cwp-field">
			<div
				className={`cwp-checkbox-set ${isRequired ? "required-checkbox" : ""}`}
			>
				{!isEmpty(label) && (
					<label dangerouslySetInnerHTML={{ __html: getLabel() }}></label>
				)}
				{options.map((checkbox, index) => {
					return (
						<div className={`cwp-checkbox-option`}>
							<input
								{...getRequired(index)}
								id={id.concat(index.toString())}
								name={id}
								value={checkbox.label}
								data-rule="false"
								data-cwp-field
								checked={checkbox.checked}
								type="checkbox"
							/>
							<label for={id.concat(index.toString())}>{checkbox.label}</label>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default save;
