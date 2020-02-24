import React, { useEffect } from "react";
import {
	PanelBody,
	ColorPalette,
	RangeControl,
	Button,
	Toolbar,
	Tooltip,
	TextControl,
	FormToggle,
	PanelRow
} from "@wordpress/components";
import {
	getFieldName,
	extract_id,
	getEncodedData,
	basicColorScheme
} from "../../block/misc/helper";
import { set, clone, isEmpty } from "lodash";
import { getSiblings } from "../../block/functions/index";
import ConditionalLogic from "../../block/components/condition";
import FormulaBuilder from "../../block/components/formulaBuilder";

const {
	InspectorControls,
	BlockControls,
	BlockIcon,
	RichText
} = wp.blockEditor;

const { __ } = wp.i18n;
function edit(props) {
	const handleLabel = label => {
		props.setAttributes({ label });
	};

	const {
		calculation,
		label,
		field_name,
		condition,
		styling,
		formulaBuilder,
		postfix,
		prefix
	} = props.attributes;

	const setStyling = (style, styleName) => {
		const newStyling = clone(styling);

		set(newStyling, styleName, style);

		props.setAttributes({ styling: newStyling });
	};

	useEffect(() => {
		if (field_name === "") {
			props.setAttributes({
				field_name: getFieldName("calculation", props.clientId)
			});
			props.setAttributes({
				id:
					props.clientId +
					"__" +
					getEncodedData("calculation", props.clientId, false)
			});
		} else if (field_name !== "") {
			props.setAttributes({
				id:
					extract_id(field_name) +
					"__" +
					getEncodedData("calculation", extract_id(field_name), false)
			});
		}
	}, []);

	return [
		!!props.isSelected && (
			<InspectorControls>
				<PanelBody title={__("Field Settings")} icon="admin-generic">
					<div className="cwp-option">
						<h3>Prefix</h3>

						<TextControl
							value={prefix}
							onChange={val => props.setAttributes({ prefix: val })}
						/>
					</div>
					<div className="cwp-option">
						<h3>Postfix</h3>

						<TextControl
							value={postfix}
							onChange={val => props.setAttributes({ postfix: val })}
						/>
					</div>
					<div className="cwp-option">
						<PanelRow>
							<h3>Formula Editor</h3>
							<FormToggle
								checked={formulaBuilder}
								onChange={() =>
									props.setAttributes({ formulaBuilder: !formulaBuilder })
								}
							/>
						</PanelRow>
					</div>
				</PanelBody>
				<PanelBody title="Condition" icon="hidden">
					<ConditionalLogic
						condition={condition}
						set={props.setAttributes}
						clientId={props.clientId}
						useCondition={props.attributes.enableCondition}
					/>
				</PanelBody>
				<PanelBody title={__("Styling")} icon="admin-appearance">
					<div className="cwp-option">
						<RangeControl
							value={styling.fontSize}
							label={__("Font Size")}
							onChange={size => setStyling(size, "fontSize")}
						/>
					</div>
				</PanelBody>
			</InspectorControls>
		),
		!!props.isSelected && (
			<BlockControls>
				<Toolbar>
					<Tooltip
						text={__(formulaBuilder ? "Preview Field" : "Formula Editor")}
					>
						<Button
							onClick={() => {
								props.setAttributes({ formulaBuilder: !formulaBuilder });
							}}
						>
							<BlockIcon icon={formulaBuilder ? "no" : "edit"} showColors />
						</Button>
					</Tooltip>
				</Toolbar>
			</BlockControls>
		),

		<div className={`cwp-calculation cwp-field ${props.className}`}>
			<div className="cwp-calc-toggle">
				<h3>Formula Editor</h3>
				<FormToggle
					checked={formulaBuilder}
					onChange={() =>
						props.setAttributes({ formulaBuilder: !formulaBuilder })
					}
				/>
			</div>
			{formulaBuilder ? (
				<FormulaBuilder data={props} />
			) : (
				<div className="cwp-field-set">
					<RichText tag="label" value={label} onChange={handleLabel} />
					<div className="cwp-result-wrap">
						{!isEmpty(prefix) && <span style={styling}>{prefix}</span>}
						<span className="cwp-calc-result" style={styling}>
							XX
						</span>
						{!isEmpty(postfix) && <span style={styling}>{postfix}</span>}
					</div>
				</div>
			)}
		</div>
	];
}

export default edit;
