import React from "react";
import { map } from "lodash";
const { getBlock } = wp.data.select("core/block-editor");

function TemplateBuilder(prop) {
	const props = prop.data;

	const { clientId } = props,
		{
			template: { subject, body },
			template
		} = props.attributes;

	let child_fields = getBlock(clientId).innerBlocks;

	let fields = map(child_fields, field => {
		if (field.name.startsWith("cwp/") && field.name !== "cwp/form-column") {
			const { field_name } = field.attributes;
			return <button>{field_name}</button>;
		}
	});

	const handleChange = (e, t) => {
		let v = e.target.value;

		props.setAttributes({
			template: JSON.stringify({ ...JSON.parse(template), [t]: v })
		});
	};

	return (
		<div className="cwp-template-builder">
			{fields}
			<div className="cwp-builder-field">
				<label>Subject</label>
				<input value={subject} onChange={e => handleChange(e, "subject")} />
			</div>

			<div className="cwp-builder-field">
				<label>Body</label>
				<textarea
					value={body}
					onChange={e => handleChange(e, "body")}
				></textarea>
			</div>
		</div>
	);
}

export default TemplateBuilder;
