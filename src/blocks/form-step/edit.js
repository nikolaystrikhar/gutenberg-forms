import React, { useEffect, useState, Fragment } from "react";
import { InnerBlocks } from "@wordpress/block-editor";
import { getRootFormBlock } from "../../../src/block/functions/index";
import { isEmpty, get } from "lodash";
import { Notice, TextControl, PanelBody } from "@wordpress/components";
import { TEXT_DOMAIN } from "../../block/constants";

const { InspectorControls } = wp.blockEditor;
const { __ } = wp.i18n;

function edit(props) {
	const [disabled, setDisabled] = useState(false);

	const { setAttributes } = props;
	const { label } = props.attributes;

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
				<PanelBody initialOpen={true} title={__("Step Settings", TEXT_DOMAIN)}>
					<TextControl
						placeholder={__("Form Step", TEXT_DOMAIN)}
						label={__("Label", TEXT_DOMAIN)}
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
				<Fragment>
					<span className="step-divider start">
						<div class="divider">
							<span></span>
							<span>Step Start</span>
							<span></span>
						</div>
					</span>
					<InnerBlocks
						templateLock={false}
						renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
					/>
				</Fragment>
			)}
		</div>,
	];
}

export default edit;
