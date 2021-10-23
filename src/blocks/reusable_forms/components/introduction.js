const { __ } = wp.i18n;
import React, { useState } from "react";
import { Placeholder, Button, SelectControl } from "@wordpress/components";
import { get } from "lodash";

function Introduction(props) {
	const savedForms = get(window, "cwpGlobal.cwp-cpt-forms");

	const [form, setForm] = useState("");

	const formOptions = savedForms.map((form) => {
		const form_id = get(form, "ID");
		const title = get(form, "post_title");

		return {
			label: title,
			value: form_id,
		};
	});

	return (
		<Placeholder
			className="cwp-reusable-intro"
			icon="index-card"
			label={__("Select Gutenberg Form", "cwp-gutenberg-forms")}
			instructions="Select a saved form."
		>
			<div className="content">
				<SelectControl
					className="cwp-reusable-select"
					value={form}
					options={[
						{
							label: "Insert Form",
							value: "",
						},
						...formOptions,
					]}
					onChange={setForm}
				/>
				<Button isPrimary isSmall onClick={() => props.onSelect(form)}>
					Select
				</Button>
			</div>
		</Placeholder>
	);
}

export default Introduction;
