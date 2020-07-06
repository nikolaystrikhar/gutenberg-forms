import React from "react";
import { basicColorScheme } from "../../../misc/helper";
import { ColorPalette } from "@wordpress/components";
import { TEXT_DOMAIN } from "../../../constants";

const { __ } = wp.i18n;

function Settings(props) {
	const { color } = props.value;

	return (
		<div className="cwp-icon-settings">
			<h3>{__("Icon Color", TEXT_DOMAIN)}</h3>
			<ColorPalette
				colors={basicColorScheme}
				value={color}
				onChange={(color) => props.onChange({ color })}
			/>
		</div>
	);
}

export default Settings;
