import React, { Fragment } from "react";
import {
	Tooltip,
	Toolbar,
	ToolbarButton,
	IconButton,
} from "@wordpress/components";
import { isEmpty, isEqual, has, get } from "lodash";

const { BlockControls } = wp.blockEditor;
const { __ } = wp.i18n;
const {
	removeBlock,
	moveBlocksUp,
	moveBlocksDown,
	selectBlock,
	duplicateBlocks,
} = wp.data.dispatch("core/block-editor");

function BlockToolbar(props) {
	const {
		clientId,
		selectedStep,
		childAttributes,
		setStep,
		refreshAttributes,
	} = props;

	const isStepAvailable = () => {
		// verification function that will confirm if the step is selected and available
		// so we can show actions regarding step

		if (has(childAttributes, selectedStep)) {
			// checking if the child attribute has selected index

			return true;
		}

		return false;
	};

	/**
	 * @param {The index of the required step} index
	 */

	const getStepFromIndex = (index) => {
		if (has(childAttributes, index)) {
			const requiredStep = childAttributes[selectedStep];
			return requiredStep;
		}
		return false;
	};

	const deleteStep = () => {
		const currentStep = getStepFromIndex(selectedStep);
		const stepClientId = get(currentStep, `clientId`);

		removeBlock(stepClientId).then(() => {
			// on success
			let beforeSelectedStep = selectedStep - 1;

			refreshAttributes(); // refreshing the attributes

			if (has(childAttributes, beforeSelectedStep)) {
				setStep(beforeSelectedStep); // setting the current step position to -1 (if available)
			}

			//! after deletion the selection moves to another block therefore
			//! selecting the root block again

			selectBlock(clientId);
		});
	};

	const duplicateStep = () => {
		const currentStep = getStepFromIndex(selectedStep);
		const currentStepClientId = get(currentStep, "clientId");

		duplicateBlocks(
			[currentStepClientId], // client IDS of blocks to duplicate
			clientId // root clientId
		).then(() => {
			refreshAttributes();

			const newStepIndex = selectedStep + 1;

			setStep(newStepIndex);

			//! after duplication the selection moves to another block therefore
			//! selecting the root block again
			selectBlock(clientId);
		});
	};

	const moveStepUp = () => {
		const currentStep = getStepFromIndex(selectedStep);
		const currentStepClientId = get(currentStep, "clientId");
		const newStepIndex = selectedStep - 1; // selecting the before step because this will move to the left

		if (!has(childAttributes, newStepIndex)) {
			return; // breaking if no step are available to move
		}

		moveBlocksUp(
			[currentStepClientId], // client ids of the blocks which will move up
			clientId // client id of root block
		).then(() => {
			// on success

			refreshAttributes(); // finally updating the labels
			setStep(newStepIndex);
		});
	};

	const moveStepDown = () => {
		const currentStep = getStepFromIndex(selectedStep);
		const currentStepClientId = get(currentStep, "clientId");
		const newStepIndex = selectedStep + 1; // selecting the after step because this will move to the right

		if (!has(childAttributes, newStepIndex)) {
			return; // breaking if no step are available to move
		}

		moveBlocksDown(
			[currentStepClientId], // client ids of the blocks which will move up
			clientId // client id of root block
		).then(() => {
			// on success

			refreshAttributes(); // finally updating the labels
			setStep(newStepIndex);
		});
	};

	return (
		<BlockControls>
			<Toolbar>
				{isStepAvailable() && (
					<Fragment>
						<Tooltip text={__("Move Step Up", "forms-gutenberg")}>
							<IconButton icon="arrow-left-alt2" onClick={moveStepUp} />
						</Tooltip>
						<Tooltip text={__("Move Step Down", "forms-gutenberg")}>
							<IconButton icon="arrow-right-alt2" onClick={moveStepDown} />
						</Tooltip>
						<Tooltip text={__("Delete Step", "forms-gutenberg")}>
							<IconButton icon="trash" onClick={deleteStep} />
						</Tooltip>
						<Tooltip text={__("Duplicate Step", "forms-gutenberg")}>
							<IconButton icon="admin-page" onClick={duplicateStep} />
						</Tooltip>
					</Fragment>
				)}
			</Toolbar>
		</BlockControls>
	);
}
export default BlockToolbar;
