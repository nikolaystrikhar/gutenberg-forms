import React from "react";
import { MenuGroup, MenuItem } from "@wordpress/components";
import {
	getFieldsTags,
	getWordpressTags,
	getFormTags,
	getOtherTags,
} from "../functions";
import { get, isEmpty, has } from "lodash";

function TagList(props) {
	const { onSelect, data } = props;

	const mapList = (list) => {
		return list.map((tag, index) => {
			const title = get(tag, "title");
			const Tag = get(tag, "tag");

			return (
				<MenuItem className="cwp-tag-option" onClick={() => onSelect(Tag)}>
					<strong>{title}</strong>
					<span>{Tag}</span>
				</MenuItem>
			);
		});
	};

	const getList = () => {
		const requiredList = props.list;

		switch (requiredList) {
			case "fields":
				let fieldsTagList = isEmpty(data)
					? getFieldsTags(props.clientId, false)
					: data;

				return fieldsTagList.map((field, index) => {
					const id = get(field, "field_id");
					const label = get(field, "fieldName");
					const tag = `{{${id}}}`;

					return (
						<MenuItem className="cwp-tag-option" onClick={() => onSelect(tag)}>
							<strong>{isEmpty(label) ? "No Label" : label}</strong>
							<span>{tag}</span>
						</MenuItem>
					);
				});
			case "wordpress":
				const wpTags = isEmpty(data) ? getWordpressTags() : data;
				return mapList(wpTags);
			case "form":
				const formTags = isEmpty(data) ? getFormTags() : data;
				return mapList(formTags);
			case "other":
				const otherTags = isEmpty(data) ? getOtherTags() : data;
				return mapList(otherTags);
		}
	};

	const noStyling = has(props, "noStyling");
	const classes = noStyling ? "no-styling" : "";

	return (
		<div className={`cwp-tagList ${classes}`}>
			<MenuGroup>{getList()}</MenuGroup>
		</div>
	);
}

export default TagList;
