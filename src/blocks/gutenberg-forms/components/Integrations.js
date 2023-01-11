import React, { Fragment, useEffect } from "react";
import FieldPlotter from "./fieldPlotter";
import { get, isEqual, map, each, includes, clone, omit, set } from "lodash";

const { __ } = wp.i18n;
const { PanelBody } = wp.components;

function Integrations(props) {
	const integrations = get(window, "cwpGlobal.settings.integrations");
	const savedIntegrations = props.data.attributes.integrations;
	const { actions } = props.data.attributes;

	// responsible for keeping the form actions and integrations synchronized
	useEffect(() => {
		each(savedIntegrations, (integration, name) => {
			const title = get(integrations[name], "title");
			const hasActionOfCurrentIntegration = includes(actions, title); // checking if the action has current integration

			if (!hasActionOfCurrentIntegration) {
				const newIntegrations = clone(savedIntegrations);
				const withoutCurrentIntegrations = omit(newIntegrations, [name]); // deleting the current integration from the list

				props.data.setAttributes({ integrations: withoutCurrentIntegrations });
			}
		});
	}, [actions]);

	useEffect(() => {
		each(integrations, (integration, name) => {
			const title = get(integration, "title");
			const hasActionOfCurrentIntegration = includes(actions, title); // checking if the action has current integration
			const isAllFieldIntegration = get(integration, "include_all_fields");

			if (isAllFieldIntegration && hasActionOfCurrentIntegration === true) {
				// if this integration support all field then the field plotter will be hidden
				// therefore updating the integration attribute manually

				const newIntegrations = clone(savedIntegrations);
				set(newIntegrations, name, new Object());
				props.data.setAttributes({ integrations: newIntegrations });
			}
		});
	}, [actions]);

	return (
		<Fragment>
			{map(integrations, (integration, name) => {
				const api_fields = get(integration, "api_fields"),
					query_fields = get(integration, "query_fields"),
					title = get(integration, "title"),
					enable = get(integration, "enable"),
					fields = get(integration, "fields"),
					type = get(integration, "type"),
					include_all_fields = get(integration, "include_all_fields");
				if (
					enable &&
					actions.includes(title) &&
					isEqual(type, "autoResponder") &&
					!include_all_fields
				) {
					return (
						<PanelBody title={__(title, "forms-gutenberg")}>
							<FieldPlotter
								fields={fields}
								title={title}
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
