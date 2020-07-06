import React, { useState, Fragment } from "react";
import IconPicker from "./components/index";
import { TEXT_DOMAIN } from "../../constants";
import { Popover } from "@wordpress/components";
const { RichTextToolbarButton, RichTextShortcut } = wp.editor;
const { toggleFormat, insert } = wp.richText;
const { __ } = wp.i18n;
const { getRectangleFromRange } = wp.dom;

const name = "cwp/icon-insert";

function edit({ isActive, value, onChange }) {
	const [anchorRange, setAnchorRange] = useState(undefined);

	const onToggle = () => {
		// Set up the anchorRange when the Popover is opened.
		const selection = window.getSelection();
		const caretPos = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

		setAnchorRange(caretPos);

		onChange(
			toggleFormat(value, {
				type: name,
			})
		);
	};

	// Pin the Popover to the caret position.
	const anchorRect = () => {
		return getRectangleFromRange(anchorRange);
	};

	if (isActive) {
		return (
			<Popover
				position="bottom center"
				focusOnMount="container"
				expandOnMobile={true}
				className="cwp-icon-picker__component__popup"
				getAnchorRect={anchorRect}
				headerTitle={__("Insert Icon", TEXT_DOMAIN)}
				onClose={() => {
					onChange(toggleFormat(value, { type: name }));
				}}
			>
				<IconPicker
					onSelect={(icon) => {
						onChange(insert(value, icon));
					}}
				/>
			</Popover>
		);
	}

	return (
		<Fragment>
			<RichTextShortcut type="primary" character="i" onUse={onToggle} />
			<RichTextToolbarButton
				icon="editor-underline"
				title={__("Icon", TEXT_DOMAIN)}
				onClick={onToggle}
				isActive={isActive}
				shortcutType="primary"
				shortcutCharacter="i"
			/>
		</Fragment>
	);
}

export default edit;
