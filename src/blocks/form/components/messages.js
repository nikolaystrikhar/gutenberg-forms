import React, { Fragment } from "react";
import { TextControl, Icon } from "@wordpress/components";
import { firstCapital, getFieldIcon } from "../../../block/misc/helper.js";
import { has } from "lodash";
const { __ } = wp.i18n;

export default function CustomMessages(props) {
	const { val } = props;

	const handleChange = (t, v, i, fieldName) => {
		props.onChange(t, v, i, fieldName);
	};

	return (
		<Fragment>
			{val.map((v, i) => {
				let fieldName = "cwp/".concat(v.fieldName);

				return (
					<Fragment>
						<div className="cwp-option">
							{/* <TextControl
								onChange={value => handleChange("empty", value, i, fieldName)}
								label="Required"
								value={v.empty}
							/> */}
							{has(v, "invalid") && (
								<Fragment>
									<h3 className="cwp-message_header">
										<strong>
											{"Invalid ".concat(firstCapital(v.fieldName))}
										</strong>
										<Icon icon={getFieldIcon(fieldName)} />
									</h3>
									<TextControl
										onChange={value =>
											handleChange("invalid", value, i, fieldName)
										}
										value={v.invalid}
									/>
								</Fragment>
							)}
							{has(v, "invalidEmail") && (
								<Fragment>
									<h3 className="cwp-message_header">
										<strong>
											{"Invalid ".concat(firstCapital(v.fieldName))}
										</strong>
										<Icon icon={getFieldIcon(fieldName)} />
									</h3>
									<TextControl
										onChange={value =>
											handleChange("invalidEmail", value, i, fieldName)
										}
										value={v.invalidEmail}
									/>
								</Fragment>
							)}
							{has(v, "invalidName") && (
								<Fragment>
									<h3 className="cwp-message_header">
										<strong>
											{"Invalid ".concat(firstCapital(v.fieldName))}
										</strong>
										<Icon icon={getFieldIcon(fieldName)} />
									</h3>
									<TextControl
										onChange={value =>
											handleChange("invalidName", value, i, fieldName)
										}
										value={v.invalidName}
									/>
								</Fragment>
							)}
						</div>
					</Fragment>
				);
			})}
		</Fragment>
	);
}
