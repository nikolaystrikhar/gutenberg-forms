import React from "react";
import { isEmpty } from "lodash";
import { strip_tags } from "../../block/misc/helper";
import { stringifyCondition } from "../../block/functions";

function save(props) {
	const {
		calculation,
		label,
		id,
		formula,
		condition,
		enableCondition,
		prefix,
		postfix,
		styling,
		decimalPlaces
	} = props.attributes;

	const getLabel = () => {
		const { label } = props.attributes;

		return label;
	};

	const getCondition = () => {
		if (props.attributes.enableCondition) {
			//verifying the condition
			return {
				"data-condition": stringifyCondition(condition)
			};
		}

		return {};
	};

	const getCalculation = () => {
		if (!isEmpty(formula)) {
			return {
				"data-cwp-calculation": formula
			};
		}

		return {};
	};

	return (
		<div
			className="cwp-calculation cwp-field"
			data-deci={decimalPlaces}
			{...getCalculation()}
			{...getCondition()}
		>
			<div className="cwp-field-set">
				{!isEmpty(label) && (
					<label
						for={id}
						dangerouslySetInnerHTML={{ __html: getLabel() }}
					></label>
				)}
				<div className="cwp-result-wrap" style={styling}>
					{!isEmpty(prefix) && <span style={styling}>{prefix}</span>}
					<span className="cwp-calc-result" style={styling}>
						0
					</span>
					{!isEmpty(postfix) && <span style={styling}>{postfix}</span>}
				</div>
				<input
					id={id}
					aria-label={strip_tags(label)}
					name={id}
					type="hidden"
					data-rule="false"
					data-cwp-field
					readOnly
					placeholder={calculation}
				/>
			</div>
		</div>
	);
}

export default save;
