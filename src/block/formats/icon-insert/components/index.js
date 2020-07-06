import React, { useState } from "react";
import {
	TextControl,
	IconButton,
	ColorIndicator,
	Tooltip,
} from "@wordpress/components";

import IconSettings from "./settings";
import { TEXT_DOMAIN } from "../../../constants";
import IconList from "./icon-list";
import { isEmpty } from "lodash";

const { __ } = wp.i18n;

function IconPicker(props) {
	const [search, setSearch] = useState("");
	const [settings, setSettings] = useState({
		enabled: false,
		color: "",
	});

	const handleSearch = (search) => {
		setSearch(search);
	};

	const toggleSettings = () => {
		setSettings({
			...settings,
			enabled: !settings.enabled,
		});
	};

	return (
		<div className="cwp-icon-picker__component">
			<div>
				<h3>{__("Search Icons", TEXT_DOMAIN)}</h3>
				<TextControl
					value={search}
					placeholder={__("Type to search...", TEXT_DOMAIN)}
					onChange={handleSearch}
				/>
			</div>
			<div className="icon-settings">
				<div>
					{!isEmpty(settings.color) && (
						<Tooltip text={__("Icon Color", TEXT_DOMAIN)}>
							<ColorIndicator colorValue={settings.color} />
						</Tooltip>
					)}
				</div>
				<IconButton
					onClick={toggleSettings}
					icon={settings.enabled ? "arrow-up" : "admin-settings"}
					label={__("Icon Settings", TEXT_DOMAIN)}
				/>
			</div>
			{settings.enabled && (
				<IconSettings
					value={settings}
					onChange={(newSettings) =>
						setSettings({ ...settings, ...newSettings })
					}
				/>
			)}
			<IconList onSelect={props.onSelect} settings={settings} />
		</div>
	);
}

export default IconPicker;
