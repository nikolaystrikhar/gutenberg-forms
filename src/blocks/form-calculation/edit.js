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
	basicColorScheme,
	extract_admin_id,
	get_admin_id
} from "../../block/misc/helper";
import { set, clone, isEmpty } from "lodash";
import { getSiblings, detect_similar_forms } from "../../block/functions/index";
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
		prefix,
		adminId,
		decimalPlaces
	} = props.attributes;

	const setStyling = (style, styleName) => {
		const newStyling = clone(styling);

		set(newStyling, styleName, style);

		props.setAttributes({ styling: newStyling });
	};


	const getRootData = () => {
		if (field_name === "" || detect_similar_forms(props.clientId)) {

			const newFieldName = getFieldName("calculation", props.clientId);

			props.setAttributes({
				field_name: newFieldName,
				adminId: {
					value: extract_admin_id(newFieldName, 'calculation'),
					default: extract_admin_id(newFieldName, 'calculation')
				}
			});
			props.setAttributes({
				id:
					props.clientId +
					"__" +
					getEncodedData("calculation", props.clientId, false, get_admin_id(adminId))
			});
		} else if (field_name !== "") {
			props.setAttributes({
				id:
					extract_id(field_name) +
					"__" +
					getEncodedData("calculation", extract_id(field_name), false, get_admin_id(adminId))
			});
		}
	}

	useEffect(() => {
		getRootData()
	}, []);

	useEffect(() => {
		getRootData()
	}, [props]);


	const handleAdminId = (id) => {
		props.setAttributes({
			adminId: {
				...adminId,
				value: id.replace(/\s|-/g, "_")
			}
		})
	}

	return [
		!!props.isSelected && (
			<InspectorControls>
				<PanelBody title={__("Field Settings", "forms-gutenberg")}>

					<div className="cwp-option">
						<TextControl
							placeholder={adminId.default}
							label={__("Field ID", "forms-gutenberg")}
							value={adminId.value}
							onChange={handleAdminId}
						/>
					</div>

					<div className="cwp-option">
						<h3>{__("Prefix", "forms-gutenberg")}</h3>

						<TextControl
							value={prefix}
							onChange={val => props.setAttributes({ prefix: val })}
						/>
					</div>
					<div className="cwp-option">
						<h3>{__("Postfix", "forms-gutenberg")}</h3>

						<TextControl
							value={postfix}
							onChange={val => props.setAttributes({ postfix: val })}
						/>
					</div>
					<div className="cwp-option">
						<PanelRow>
							<h3>{__("Formula Editor", "forms-gutenberg")}</h3>
							<FormToggle
								checked={formulaBuilder}
								onChange={() =>
									props.setAttributes({ formulaBuilder: !formulaBuilder })
								}
							/>
						</PanelRow>
					</div>
					<div className="cwp-option">
						<RangeControl
							value={decimalPlaces}
							min={0}
							max={10}
							label={__("Decimal Places", "forms-gutenberg")}
							onChange={decimalPlaces => props.setAttributes({ decimalPlaces })}
						/>
					</div>
				</PanelBody>
				<PanelBody title={__("Condition", "forms-gutenberg")}>
					<ConditionalLogic
						condition={condition}
						set={props.setAttributes}
						clientId={props.clientId}
						useCondition={props.attributes.enableCondition}
					/>
				</PanelBody>
				<PanelBody title={__("Styling", "forms-gutenberg")}>
					<div className="cwp-option">
						<RangeControl
							value={styling.fontSize}
							label={__("Font Size", "forms-gutenberg")}
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
						text={__(formulaBuilder ? __("Preview Field", "forms-gutenberg") : __("Formula Editor", "forms-gutenberg"))}
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
				<h3>{__("Formula Editor", "forms-gutenberg")}</h3>
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
						<RichText placeholder={__("Add a label", "forms-gutenberg")} tag="label" value={label} onChange={handleLabel} />
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
