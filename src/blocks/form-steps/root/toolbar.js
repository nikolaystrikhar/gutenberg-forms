import React from "react";
import {
	Tooltip,
	Toolbar,
	ToolbarButton,
	IconButton,
} from "@wordpress/components";
import { TEXT_DOMAIN } from "../../../block/constants";
import { isEmpty, isEqual, has, get } from "lodash";

const { BlockControls } = wp.blockEditor;
const { __ } = wp.i18n;
const { removeBlock } = wp.data.dispatch("core/block-editor");

function BlockToolbar(props) {
	const { clientId, selectedStep, childAttributes, setStep } = props;

	const isStepAvailable = () => {
		// verification function that will confirm if the step is selected and available
		// so we can show actions regarding step

		if (has(childAttributes, selectedStep)) {
			// checking if the child attribute has selected index

			return true;
		}

		return false;
	};

	const deleteStep = () => {
		const stepClientId = get(childAttributes[selectedStep], `clientId`);

		removeBlock(stepClientId).then(() => {
			// on success
			let beforeSelectedStep = selectedStep - 1;

			setStep(beforeSelectedStep);
		});
	};

	return (
		<BlockControls>
			<Toolbar>
				{isStepAvailable() && (
					<Tooltip text={__("Delete Step", TEXT_DOMAIN)}>
						<IconButton icon="trash" onClick={deleteStep} />
					</Tooltip>
				)}
			</Toolbar>
		</BlockControls>
	);
}
export default BlockToolbar;
