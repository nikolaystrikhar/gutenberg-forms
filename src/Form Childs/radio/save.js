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
		<div className="cwp-radio cwp-field">
			<div className="cwp-radio-set">
				{!isEmpty(label) && (
					<label dangerouslySetInnerHTML={{ __html: getLabel() }}></label>
				)}
				<form>
					{options.map((radio, index) => {
						return (
							<div className="cwp-radio-option">
								<input
									name="option"
									value={radio.label}
									checked={radio.checked}
									type="radio"
								/>
								<label>{radio.label}</label>
							</div>
						);
					})}
				</form>
			</div>
		</div>
	);
}

export default save;
