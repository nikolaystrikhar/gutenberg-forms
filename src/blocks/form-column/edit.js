import React, { useEffect } from "react";
import { InnerBlocks, InspectorControls } from "@wordpress/block-editor";
import {
	RangeControl,
	PanelBody,
	FormToggle,
	PanelRow
} from "@wordpress/components";
import Introduction from "./components/introduction";
import { createBlock } from "@wordpress/blocks";
import { map } from "lodash";
import { TEXT_DOMAIN } from "../../block/constants";
const { __ } = wp.i18n;


const { replaceInnerBlocks, selectBlock } = wp.data.dispatch(
	"core/block-editor"
);
const { getBlock } = wp.data.select("core/block-editor");

function edit(props) {
	const { columns, intro, stack } = props.attributes,
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

	const createBlocksFromInnerBlocksTemplate = innerBlocksTemplate => {
		return map(innerBlocksTemplate, ([name, attributes, innerBlocks = []]) =>
			createBlock(
				name,
				attributes,
				createBlocksFromInnerBlocksTemplate(innerBlocks)
			)
		);
	};

	return [
		<InspectorControls>
			<PanelBody icon={__("layout", TEXT_DOMAIN)} title={__("Layout Settings", TEXT_DOMAIN)}>
				<div className="cwp-option">
					<RangeControl
						label={__("Columns", TEXT_DOMAIN)}
						max={6}
						min={2}
						onChange={c => {
							props.setAttributes({ columns: c });

							const currentInnerBlocks = getBlock(props.clientId).innerBlocks;

							if (c > currentInnerBlocks.length - 1) {
								for (let i = columns; i < c; ++i) {
									currentInnerBlocks.push(
										...createBlocksFromInnerBlocksTemplate([
											["cwp/column", {}]
										])
									);
								}
								replaceInnerBlocks(props.clientId, currentInnerBlocks);
								selectBlock(props.clientId);
							} else {
								currentInnerBlocks.pop();
								replaceInnerBlocks(props.clientId, currentInnerBlocks);
								selectBlock(props.clientId);
							}
						}}
						value={columns}
					/>
				</div>
				<div className="cwp-option">
					<PanelRow>
						<h3>{__("Stack on Mobile", TEXT_DOMAIN)}</h3>
						<FormToggle
							checked={stack}
							onChange={() => setAttributes({ stack: !stack })}
						/>
					</PanelRow>
				</div>
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
