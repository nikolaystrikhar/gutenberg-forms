import React, { useEffect, useState, Fragment } from "react";
import { InnerBlocks } from "@wordpress/block-editor";
import { getRootFormBlock } from "../../../../block/functions/index";
import { isEmpty, get } from "lodash";
import { Notice, TextControl, PanelBody } from "@wordpress/components";

const { InspectorControls } = wp.blockEditor;
const { __ } = wp.i18n;

function edit(props) {
	const [disabled, setDisabled] = useState(false);

	const { setAttributes } = props;
	const { label, hideStep } = props.attributes;

	useEffect(() => {
		const root = getRootFormBlock(props.clientId);

		if (!isEmpty(root)) {
			let root_type = get(root, "attributes.formType");

			root_type === "standard" ? setDisabled(true) : null; // checking if the root form is a multistep
		}
	}, []);

	return [
		props.isSelected && !disabled && (
			<InspectorControls>
				<PanelBody initialOpen={true} title={__("Step Settings", "forms-gutenberg")}>
					<TextControl
						placeholder={__("Form Step", "forms-gutenberg")}
						label={__("Label", "forms-gutenberg")}
						value={label}
						onChange={(label) => setAttributes({ label })}
					/>
				</PanelBody>
			</InspectorControls>
		),
		null,
		<div className="cwp-form-step">
			{disabled ? (
				<Notice status="warning" isDismissible={false}>
					This is to be used only within the Multi-Step Form.
				</Notice>
			) : (
				<div
					className="cwp-add-step-appender"
					style={{ display: hideStep ? "none" : "block" }}
				>
					<InnerBlocks template={[["core/paragraph", {}]]} />
				</div>
			)}
		</div>,
	];
}

export default edit;
