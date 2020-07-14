import React, { Fragment } from "react";
import { TEXT_DOMAIN } from "../../../block/constants";
import FieldPlotter from "./fieldPlotter";
import { get, isEqual, map } from "lodash";

const { __ } = wp.i18n;
const { PanelBody } = wp.components;

function Integrations(props) {
	const { integrations } = cwpGlobal.settings;
	const { actions } = props.data.attributes;

	return (
		<Fragment>
			{map(integrations, (integration, name) => {
				const api_fields = get(integration, "api_fields"),
					query_fields = get(integration, "query_fields"),
					title = get(integration, "title"),
					enable = get(integration, "enable"),
					fields = get(integration, "fields"),
					type = get(integration, "type");
				if (
					enable &&
					actions.includes(title) &&
					isEqual(type, "autoResponder")
				) {
					return (
						<PanelBody title={__(title, TEXT_DOMAIN)}>
							<FieldPlotter
								fields={fields}
								name={name}
								data={props.data}
								clientId={props.clientId}
								api_fields={api_fields}
								query_fields={query_fields}
							/>
						</PanelBody>
					);
				}
			})}
		</Fragment>
	);
}

export default Integrations;
