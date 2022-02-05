import React from "react";
import { isEmpty } from "lodash";
import { strip_tags } from "../../block/misc/helper";
import { stringifyCondition } from "../../block/functions";
import Prefix from "../components/prefix";
import Suffix from "../components/suffix";

function save(props) {
	const {
		placeholder,
		isRequired,
		label,
		id,
		requiredLabel,
		type,
		messages: { empty },
		format,
		condition,
		enableCondition,
		prefix,
		suffix,
		hint,
		showHint
	} = props.attributes;

	const getLabel = () => {
		const { label, isRequired } = props.attributes;
		let required = !isEmpty(requiredLabel)
			? `<abbr title="required" aria-label="required">${requiredLabel}</abbr>`
			: "";
		let required_label = label + " " + required;

		if (isRequired) return required_label;

		return label;
	};

	let getFieldType = () => {
		switch (type) {
			case "both":
				return "datetime-local";
			case "time":
				return "time";
			case "date":
				return "date";
		}
	};

	let errors = JSON.stringify({
		empty,
	});

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
		<div className="cwp-datepicker cwp-field" {...getCondition()}>
			<div className="cwp-field-set" data-required={isRequired}>
				{!isEmpty(label) && (
					<label
						for={id}
						dangerouslySetInnerHTML={{ __html: getLabel() }}
					></label>
				)}
				<div className="cwp-field-with-elements">
					{prefix.enable && (
						<Prefix prefix={prefix}>
							<span dangerouslySetInnerHTML={{ __html: prefix.content }}></span>
						</Prefix>
					)}
					<input
						id={id}
						type="text"
						aria-label={strip_tags(label)}
						name={id}
						readOnly
						required={isRequired}
						data-cwp-field
						data-rule="false"
						data-format={format}
						data-errors={errors}
						data-validation="date"
						data-validation-format="dd/mm/yyyy"
						data-language="en"
						value={placeholder}
					/>

					{suffix.enable && (
						<Suffix suffix={suffix}>
							<span dangerouslySetInnerHTML={{ __html: suffix.content }}></span>
						</Suffix>
					)}
				</div>
			</div>
			{showHint && (
                <p className="cwp-hint">{hint}</p>
            )}
		</div>
	);
}

export default save;
