import { __ } from '@wordpress/i18n';
import React, { Fragment, useEffect } from "react";
import {
	getFieldsTags,
	getWordpressTags,
	getFormTags,
	getOtherTags,
	getMetaTags,
} from "../functions";
import TagList from "./tagList";
import { get, isEmpty } from "lodash";

function SearchTags(props) {
	const search = props.search;

	const getFilteredTags = () => {
		const fields = getFieldsTags(props.clientId, false);
		const filteredFields = fields.filter((field) => {
			const fieldName = get(field, "fieldName");

			return fieldName.toLowerCase().search(search.toLowerCase()) !== -1;
		});

		const wpTags = getWordpressTags();
		const filteredWordpressTags = wpTags.filter((field) => {
			const title = get(field, "title");

			return title.toLowerCase().search(search.toLowerCase()) !== -1;
		});

		const formTags = getFormTags();
		const filteredFormTags = formTags.filter((field) => {
			const title = get(field, "title");

			return title.toLowerCase().search(search.toLowerCase()) !== -1;
		});

		const otherTags = getOtherTags();
		const filteredOtherTags = otherTags.filter((field) => {
			const title = get(field, "title");

			return title.toLowerCase().search(search.toLowerCase()) !== -1;
		});

		const metaTags = getMetaTags();
		const filteredMetaTags = metaTags.filter((field) => {
			const title = get(field, "title");

			return title.toLowerCase().search(search.toLowerCase()) !== -1;
		});

		return [
			{
				list: "fields",
				label: __("Fields", 'cwp-gutenberg-forms'),
				data: filteredFields,
			},
			{
				list: "wordpress",
				label: __("Wordpress Tags", 'cwp-gutenberg-forms'),
				data: filteredWordpressTags,
			},
			{
				list: "form",
				label: __("Form Tags", 'cwp-gutenberg-forms'),
				data: filteredFormTags,
			},
			{
				list: "other",
				label: __("Other Tags", 'cwp-gutenberg-forms'),
				data: filteredOtherTags,
			},
			{
				list: "meta",
				label: __("Meta", 'cwp-gutenberg-forms'),
				data: filteredMetaTags,
			},
		];
	};

	const noTagsFound = () => {
		const tags = getFilteredTags();
		let emptyGroups = [];

		tags.forEach((tag) => {
			if (isEmpty(tag.data)) {
				emptyGroups.push(tag.list);
			}
		});

		const notFound = emptyGroups.length === 5;

		return notFound;
	};

	return (
		<div className="ep-filtered-tags">
			{getFilteredTags().map((result, index) => {
				const { list, label, data } = result;

				return (
					!isEmpty(data) && (
						<Fragment>
							<h4 className="ep-filtered-group">{label}</h4>
							<TagList
								list={list}
								data={data}
								noStyling
								onSelect={props.onSelect}
							/>
						</Fragment>
					)
				);
			})}
			{noTagsFound() && (
				<div className="cwp-not-found">
					<h3>{__('No Tags Found', 'cwp-gutenberg-forms')}</h3>
				</div>
			)}
		</div>
	);
}

export default SearchTags;
