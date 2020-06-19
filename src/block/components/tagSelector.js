import React, { useState, useEffect } from "react";
import { TextControl, TabPanel } from "@wordpress/components";
import { TEXT_DOMAIN } from "../constants";
import { isEmpty } from "lodash";
import TagList from "./tagList";
import SearchTags from "./searchTags";

const { __ } = wp.i18n;

function TagSelector(props) {
	const { setAttributes } = props;
	const [search, setSearch] = useState("");

	const tabs = [
		{
			name: "fields",
			title: "Fields",
			className: "cwp-tag-button",
		},
		{
			name: "wordpress",
			title: "Wordpress",
			className: "cwp-tag-button",
		},
		{
			name: "form",
			title: "Form",
			className: "cwp-tag-button",
		},
		{
			name: "other",
			title: "Other",
			className: "cwp-tag-button",
		},
	];

	return (
		<div className="cwp-tag-selector-content">
			<div className="cwp-tag-search">
				<TextControl
					value={search}
					onChange={setSearch}
					placeholder={__("Search Tags", TEXT_DOMAIN)}
				/>
			</div>
			<div className="cwp-tags">
				{isEmpty(search) ? (
					<TabPanel
						className="cwp-tags-panels"
						activeClass="cwp-active-tag-panel"
						tabs={tabs}
					>
						{(tab) => {
							return (
								<TagList
									list={tab.name}
									clientId={props.clientId}
									onSelect={props.insertTag}
								/>
							);
						}}
					</TabPanel>
				) : (
					<SearchTags
						search={search}
						clientId={props.clientId}
						onSelect={props.insertTag}
					/>
				)}
			</div>
		</div>
	);
}

export default TagSelector;
