import React from "react";
import Icon from "../../../block/Icon";

function Introduction(props) {
	const selections = [
		{
			label: <Icon icon="twoColumn" />,
			value: 2
		},
		{
			label: <Icon icon="threeColumn" />,
			value: 3
		},
		{
			label: <Icon icon="fourColumn" />,
			value: 4
		}
	];

	return (
		<div className="cwp_column_intro_selector">
			<h3>Columns</h3>
			<p>Select your column for the form!</p>
			{selections.map(selection => (
				<button
					onClick={() => props.onSelect(selection.value)}
					className="cwp_selector"
				>
					{selection.label}
				</button>
			))}
		</div>
	);
}

export default Introduction;
