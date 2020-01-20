import React, { useState } from "react";
import { InnerBlocks, InspectorControls } from "@wordpress/block-editor";
import { RangeControl, PanelBody } from "@wordpress/components";
import Introduction from "./components/introduction";

function edit(props) {
	const { columns, intro } = props.attributes,
		{ setAttributes } = props;

	const getTemplates = () => {
		let template = [];

		for (let i = 0; i < columns; ++i) {
			template.push(["cwp/column", {}]);
		}

		return template;
	};

	const handleColumns = cols => {
		setAttributes({ columns: cols });
	};

	const handleSelect = cols => {
		setAttributes({ columns: cols, intro: true });
	};

	return [
		<InspectorControls>
			<PanelBody title="Columns Setting">
				{/* <div className="cwp-option">
					<RangeControl
						label="Columns"
						value={columns}
						min={2}
						max={4}
						onChange={handleColumns}
					/>
				</div> */}
			</PanelBody>
		</InspectorControls>,
		null,
		<div className="cwp-form-col-main">
			{!intro ? (
				<Introduction onSelect={handleSelect} />
			) : (
				<InnerBlocks
					templateLock={"insert"}
					renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
					template={getTemplates()}
					templateInsertUpdatesSelection={true}
				/>
			)}
		</div>
	];
}

export default edit;
