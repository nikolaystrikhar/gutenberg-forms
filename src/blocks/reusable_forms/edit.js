import React, { useEffect } from "react";
import Introduction from "./components/introduction";
import { isEmpty, get, has } from "lodash";
import ServerSideRender from "@wordpress/server-side-render";
import { TEXT_DOMAIN } from "../../block/constants";
import {
	SelectControl,
	Button,
	PanelBody,
	PanelRow,
} from "@wordpress/components";
import { getPostUrl } from "../../block/functions";

const { InspectorControls } = wp.blockEditor;
const { __ } = wp.i18n;

function edit(props) {
	const savedForms = get(window, "cwpGlobal.cwp-cpt-forms");
	const formOptions = savedForms.map((form) => {
		const form_id = get(form, "ID");
		const title = get(form, "post_title");

		return {
			label: title,
			value: form_id,
		};
	});

	const {
		setAttributes,
		attributes: { formId },
		isSelected,
	} = props;
	const shouldIntroduce = isEmpty(formId); // render the introduction if there is no form attributes to preview

	return [
		!!isSelected && !shouldIntroduce && (
			<InspectorControls>
				<PanelBody title={__("General", TEXT_DOMAIN)} initialOpen={true}>
					<SelectControl
						label={__("Select Form", TEXT_DOMAIN)}
						className="cwp-reusable-select"
						value={formId}
						options={[...formOptions]}
						onChange={(form) => setAttributes({ formId: form })}
					/>
					<div className="cwp-reusable-edit-url">
						<Button isLink href={getPostUrl(formId)} target="__blanks">
							Edit Form
						</Button>
					</div>
				</PanelBody>
			</InspectorControls>
		),
		null,
		<div className={`cwp-gutenberg-forms-reusable`}>
			{shouldIntroduce ? (
				<Introduction
					value={formId}
					onSelect={(id) => setAttributes({ formId: id })}
				/>
			) : (
				<div className="cwp-rendered-content">
					<ServerSideRender
						block="cwp/gutenbergformspreview"
						attributes={{
							post_id: formId,
						}}
					/>
				</div>
			)}
		</div>,
	];
}

export default edit;
