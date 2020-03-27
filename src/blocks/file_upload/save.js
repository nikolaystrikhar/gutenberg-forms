import React from "react";
import { isEmpty } from "lodash";
import { strip_tags } from "../../block/misc/helper";
import { stringifyCondition } from "../../block/functions";

function save(props) {
	const {
		file,
		isRequired,
		label,
		id,
		requiredLabel,
		messages: { empty, invalid },
		condition,
		allowedFormats
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

	let errors = JSON.stringify({
		mismatch: invalid,
		empty
	});

	const getCondition = () => {
		if (props.attributes.enableCondition && !isEmpty(condition.field)) {
			//verifying the condition
			return {
				"data-condition": stringifyCondition(condition)
			};
		}

		return {};
	};
	const suggestions = [
		"jpg",
		"jpeg",
		"png",
		"gif",
		"pdf",
		"doc",
		"docx",
		"ppt",
		"pptx",
		"odt",
		"avi",
		"ogg",
		"m4a",
		"mov",
		"mp3",
		"mp4",
		"mpg",
		"wav",
		"wmv"
	  ]

	const acceptFiles = isEmpty(allowedFormats) ? suggestions.map(s => ".".concat(s)).join(",") : allowedFormats.map(s => ".".concat(s)).join(",");

	return (
		<div className="cwp-file cwp-field" {...getCondition()}>
			<div className="cwp-field-set">
				{!isEmpty(label) && (
					<label
						for={id}
						dangerouslySetInnerHTML={{ __html: getLabel() }}
					></label>
				)}
				<input
					id={id}
					accept={acceptFiles}
					aria-label={strip_tags(label)}
					data-cwp-field
					name={id}
					title={invalid}
					data-errors={errors}
                    data-rule="false"
                    type="file"
					required={isRequired}
				/>
			</div>
		</div>
	);
}

export default save;
