import { isEmpty } from "lodash";

function save(props) {
	const { isRequired, options, label, id } = props.attributes;

	const getLabel = () => {
		const { label, isRequired } = props.attributes;

		const required = "<span>(Required)</span>";

		const required_label = label + " " + required;

		if (isRequired) {
			return required_label;
		}

		return label;
	};

	return (
		<div className="cwp-radio cwp-field">
			<div className="cwp-radio-set">
				{!isEmpty(label) && (
					<label dangerouslySetInnerHTML={{ __html: getLabel() }}></label>
				)}
				{options.map((radio, index) => {
					return (
						<div className="cwp-radio-option">
							<input
								name={id}
								data-rule="false"
								data-required={isRequired}
								value={radio.label}
								data-cwp-field
								checked={radio.checked}
								type="radio"
							/>
							<label>{radio.label}</label>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default save;
