import React, { useEffect, useState } from "react";
import {
	getLinearChildAttributes,
	addInnerBlock,
} from "../../../block/functions";
import { map, get, isEqual } from "lodash";
import { Button, IconButton } from "@wordpress/components";
import { TEXT_DOMAIN } from "../../../block/constants";
import Toolbar from "./toolbar";

const { updateBlockAttributes } = wp.data.dispatch("core/block-editor"); // for updating the label of steps
const { InnerBlocks, RichText } = wp.blockEditor;
const { __ } = wp.i18n;

function edit(props) {
	const [childAttributes, updateChildAttributes] = useState([]), // initializing child attributes state
		[step, setStep] = useState(0),
		{ clientId, attributes, setAttributes } = props,
		{ currentStep } = attributes;

	const refreshAttributes = () => {
		const updatedChildAttributes = getLinearChildAttributes(clientId, "label"); // getting the label of all the child steps

		if (!isEqual(updatedChildAttributes, childAttributes)) {
			// checking if the child attributes is updated

			updateChildAttributes(updatedChildAttributes); // updating the labels to the with latest ones
		}
		setStep(currentStep); // setting the current step when the block loads
	};

	useEffect(refreshAttributes, []); // refreshing the attributes when block loads
	useEffect(() => {
		setAttributes({ currentStep: step });
	}, [step]); // updating the attributes whenever the active step changes

	return [
		<div className="cwp-form-steps-wrapper">
			<div className="cwp-form-steps-labels">
				{map(childAttributes, (attr, index) => {
					const label = get(attr, "attributes.label");
					const blockId = get(attr, "clientId"); //? indicates if the current step is equal to the active step
					const className = isEqual(index, step) ? "is-active-step" : "";

					return (
						<div
							className="cwp-step-label-root"
							onClick={() => setStep(index)} // setting the current step active
						>
							<RichText
								tagName="a"
								className={className}
								key={index}
								value={label}
								placeholder={__("Form Step", TEXT_DOMAIN)}
								onChange={
									(newLabel) =>
										updateBlockAttributes(blockId, { label: newLabel }) // updating the form step label
								}
							/>
						</div>
					);
				})}
				<IconButton
					icon="plus"
					onClick={() => {
						addInnerBlock(clientId, "cwp/form-step"); // updating the innerBlocks
						refreshAttributes(); // refreshing the attributes
					}}
				/>
			</div>
			<InnerBlocks isSmall isDefault templateLock="insert" />
		</div>,
		<Toolbar
			{...props}
			selectedStep={currentStep}
			childAttributes={childAttributes}
			setStep={setStep}
		/>, // toolbar controls
		null, // inspector controls
	];
}

export default edit;
