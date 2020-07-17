import React from "react";
import { get, isEmpty } from "lodash";

/**
 * This component will be used before any input field ( can either be inside the input or outside )
 * for example Prefix [ Prefix Input_field Suffix ] Suffix
 */

function Prefix(props) {
	const position = get(props.prefix, "position");

	const conditionalClass = isEmpty(position) ? "" : position;
	const className = "cwp-prefix cwp-field-prefix cwp-field-element ".concat(
		conditionalClass
	);

	return <div className={className}>{props.children}</div>;
}

export default Prefix;
