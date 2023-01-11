import React, { useState, Fragment } from "react";
import { Button, Placeholder, TextControl } from "@wordpress/components";
import SettingsModal from "../settings_modal/modal";
const { __ } = wp.i18n;

function Introduction(props) {
	const [modal, setModal] = useState(false);
	const { cpt, formLabel, id } = props.data.attributes; // weather it is a cpt or not
	const { setAttributes } = props.data;

	const handleType = (type) => {
		props.onSelect(type);
		if (formLabel === "") {
			const formId = id && "form-".concat(id.split("-")[1]);

			setAttributes({ formLabel: "Gutenberg Form - ".concat(formId) });
		}
	};

	return (
		<div className="cwp-intro">
			<SettingsModal
				cpt={cpt}
				clientId={props.data.clientId}
				status={modal}
				onClose={() => setModal(false)}
			/>
			<Placeholder
				icon="feedback"
				label={__("Gutenberg Forms", "forms-gutenberg")}
				instructions={__(
					"Type a label for this form and select an option to get started.",
					"forms-gutenberg"
				)}
			>
				<div className="content">
					<TextControl
						value={formLabel}
						placeholder={__("Type form label here...", "forms-gutenberg")}
						onChange={(formLabel) => setAttributes({ formLabel })}
					/>

					<div className="types">
						<Button isDefault onClick={() => handleType("standard")}>
							{__('Standard', 'forms-gutenberg')}
						</Button>
						<span>
							{__('or', 'forms-gutenberg')}
						</span>
						<Button isDefault onClick={() => handleType("multiStep")}>
							{__('Multistep', 'forms-gutenberg')}
						</Button>
						{/*<Button isPrimary onClick={() => setModal(true)}>*/}
						{/*	Insert Form*/}
						{/*</Button>*/}
					</div>
				</div>
			</Placeholder>
		</div>
	);
}

export default Introduction;
