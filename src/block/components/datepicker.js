import React, { useEffect } from "react";
import Pikaday from "pikaday";

function Datepicker(props) {
	const inputField = React.useRef();

	useEffect(() => {
		let datePicker = new Pikaday({
			field: inputField.current,
			onSelect: date => {
				props.setAttributes({
					placeholder: datePicker.toString()
				});
			},
			format: props.format,
			toString(date, format) {
				// you should do formatting based on the passed format,
				// but we will just return 'D/M/YYYY' for simplicity
				const day = date.getDate();
				const month = date.getMonth() + 1;
				const year = date.getFullYear();

				if (format === "DD/MM/YYYY") {
					return `${day}/${month}/${year}`;
				} else if (format === "MM/DD/YYYY") {
					return `${month}/${day}/${year}`;
				} else {
					return `${year}/${month}/${day}`;
				}
			}
		});
	}, []);

	return (
		<input
			type="text"
			ref={inputField}
			readOnly
			data-format={props.format}
			data-language="en"
			value={props.value}
			onChange={props.onChange}
		/>
	);
}

export default Datepicker;
