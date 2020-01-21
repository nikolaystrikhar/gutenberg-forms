import React from "react";

function TemplateBuilder(props) {
	return (
		<div className="cwp-template-builder">
			<div className="cwp-builder-field">
				<label>Subject</label>
				<input />
			</div>

			<div className="cwp-builder-field">
				<label>Body</label>
				<textarea></textarea>
			</div>
		</div>
	);
}

export default TemplateBuilder;
