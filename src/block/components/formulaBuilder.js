import { __ } from '@wordpress/i18n';
import React, { useEffect, useRef, Fragment } from "react";
import {
	Button,
	DropdownMenu,
	MenuGroup,
	MenuItem,
} from "@wordpress/components";
import { getSiblings } from "../functions";
import { getFieldIcon } from "../misc/helper";
import { map } from "lodash";
import $ from "jquery";

function FormulaBuilder(prop) {
	const area = useRef();

	const props = prop.data;

	const { clientId } = props,
		{ formula } = props.attributes;

	const addFieldId = (name) => {
		var $txt = $(area.current);
		var caretPos = $txt[0].selectionStart;
		var textAreaTxt = $txt.val();
		var txtToAdd = `{{${name}}}`;

		const val =
			textAreaTxt.substring(0, caretPos) +
			txtToAdd +
			textAreaTxt.substring(caretPos);

		props.setAttributes({ formula: val });
	};

	return (
		<div className="cwp-form-calc-builder">
			<div className="cwp-form-available-fields">
				<h4>{__('Available Number Fields:', 'forms-gutenberg')}</h4>
				<DropdownMenu icon="list-view" label={__("Add Field Data", 'forms-gutenberg')}>
					{({ onClose }) => (
						<Fragment>
							<MenuGroup>
								{map(getSiblings(clientId, "cwp/number"), (field) => {
									const { field_name, label } = field;

									return (
										<MenuItem
											icon={getFieldIcon("cwp/number")}
											onClick={() => {
												onClose();
												addFieldId(field_name);
											}}
										>
											<span
												draggable={true}
												dangerouslySetInnerHTML={{ __html: label }}
											></span>
										</MenuItem>
									);
								})}
							</MenuGroup>
						</Fragment>
					)}
				</DropdownMenu>
			</div>
			<textarea
				value={formula}
				onChange={(e) => props.setAttributes({ formula: e.target.value })}
				ref={area}
			></textarea>
		</div>
	);
}

export default FormulaBuilder;
