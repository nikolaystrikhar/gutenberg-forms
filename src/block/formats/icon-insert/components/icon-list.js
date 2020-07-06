import React, { Fragment } from "react";
import iconPacks from "../data.json";
import { map, get, isEmpty } from "lodash";

function IconList(props) {
	const { settings } = props;

	return (
		<div className="cwp-icon-list">
			{map(iconPacks.labels, (data) => {
				const category = get(data, "category");
				const icons = get(data, "icons");

				const label = get(category, "label");
				const packSlug = get(category, "short");

				return (
					<Fragment>
						<h3>{label}</h3>
						<div className="cwp-icon-list-wrapper">
							{map(icons, (icon) => {
								const styling = !isEmpty(settings.color)
									? `style="color: ${settings.color};"`
									: "";
								const dataIcon = `${packSlug}:${icon}`;
								const selectedIcon = `<span class="iconify" ${styling} data-icon="${dataIcon}"></span>`;

								return (
									<div
										onClick={() => props.onSelect(selectedIcon)}
										className="cwp-icon-block"
									>
										<span
											class="iconify icon-width:30px icon-height:30px"
											data-icon={dataIcon}
										></span>
									</div>
								);
							})}
						</div>
					</Fragment>
				);
			})}
		</div>
	);
}

export default IconList;
