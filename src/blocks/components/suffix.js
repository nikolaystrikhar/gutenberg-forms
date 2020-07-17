import React from "react";
import { get, isEmpty } from "lodash";

/**
 * This component will be used after any input field ( can either be inside the input or outside )
 * for example Prefix [ Prefix Input_field Suffix ] Suffix
 */

function Suffix(props) {
	const position = get(props.suffix, "position");
	const conditionalClass = isEmpty(position) ? "" : position;
	const className = "cwp-suffix cwp-field-suffix cwp-field-element ".concat(
		conditionalClass
	);

	return <div className={className}>{props.children}</div>;
}

export default Suffix;
