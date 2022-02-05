import React from "react";
import { isEmpty, has } from "lodash";
import { strip_tags } from "../../block/misc/helper";
import { stringifyCondition } from "../../block/functions";

function save(props) {
	const {
		isRequired,
		options,
		label,
		id,
		messages,
		messages: { empty },
		condition,
		fieldStyle,
		enableCondition,
		hint,
		showHint,
	} = props.attributes;

	let errors = JSON.stringify({
		empty,
	});

	const getLabel = () => {
		const { label, isRequired, requiredLabel } = props.attributes;

		let required = !isEmpty(requiredLabel)
			? `<abbr title="required" aria-label="required">${requiredLabel}</abbr>`
			: "";
		let required_label = label + " " + required;

		if (isRequired) return required_label;

		return label;
	};

	const getRequired = (index) => {
		if (isRequired && index === 0) {
			return {
				"data-parsley-mincheck": "1",
			};
		} else {
			return {};
		}
	};

	const getCondition = () => {
		if (!isEmpty(condition.field) && enableCondition) {
			//verifying the condition
			return {
				"data-condition": stringifyCondition(condition),
			};
		}

		return {};
	};

	return (
		<div
			className={`cwp-checkbox cwp-field is-style-${fieldStyle}`}
			{...getCondition()}
		>
			<div
				data-errors={errors}
				className={`cwp-checkbox-set ${isRequired ? "required-checkbox" : ""}`}
			>
				{!isEmpty(label) && (
					<label dangerouslySetInnerHTML={{ __html: getLabel() }}></label>
				)}
				{options.map((checkbox, index) => {
					return (
						<div className={`cwp-checkbox-option`}>
							<input
								aria-label={strip_tags(label)}
								{...getRequired(index)}
								id={id.concat(index.toString())}
								name={id}
								value={checkbox.label}
								data-rule="false"
								data-cwp-field
								checked={checkbox.checked}
								type="checkbox"
							/>
							<label htmlFor={id.concat(index.toString())}>
								{checkbox.label}

								{has(checkbox, "image") && (
									<div className="cwp-checkbox-image">
										<img
											style={{
												height: checkbox.image.height,
												width: checkbox.image.width,
											}}
											src={checkbox.image.url}
										/>
									</div>
								)}
							</label>
						</div>
					);
				})}
			</div>
			{showHint && <p className="cwp-hint">{hint}</p>}
		</div>
	);
}

export default save;
