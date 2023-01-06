import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { each, get } from 'lodash';
import { createArrayToNum } from '../../../../../../functions';

function Chart(props) {
	const data = get(props, 'data');
	const visual_info = get(data, 'visual_info');
	const total_entries = get(data, 'total_entries');

	const formatted_data = () => {
		const formatted = [];

		each(visual_info, (info, field_name) => {
			formatted.push({
				option: field_name,
				total: get(info, 'total'),
			});
		});

		return formatted;
	};

	const chart_data = formatted_data();
	const type = get(props, 'type');

	const colorScheme =
		type === 'checkbox' ? { colors: ['#4BC4FE', '#16b3ffad'] } : {};

	return (
		<div className="cwp-checkbox-visual" style={{ height: 400 }}>
			<ResponsiveBar
				layout="horizontal"
				margin={{ top: 10, right: 20, bottom: 50, left: 60 }}
				data={chart_data}
				{...colorScheme}
				axisBottom={{
					tickSize: 5,
					tickPadding: 5,
					tickValues: createArrayToNum(total_entries),
				}}
				keys={['total']}
				indexBy="option"
			/>
		</div>
	);
}

export default Chart;
