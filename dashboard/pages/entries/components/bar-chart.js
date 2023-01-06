import React, { useEffect, useState, useRef } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import axios from 'axios';
import { get } from 'lodash';
import { parse_bar_chart_data } from '../utils';
const { Spinner, Button } = wp.components;

function BarChart() {
	const [data, setData] = useState({});
	const [keys, setKeys] = useState([]);
	const [heighest, setHeighest] = useState(0);
	const [loading, setLoading] = useState({});
	const [error, setError] = useState(false);
	const container = useRef();

	const fetch_data = () => {
		const rest_url = get(window, 'cwp_global.rest_url');
		const entries_controller_proxy = rest_url.concat(
			'gutenberg-forms/entries/v1/bar'
		);

		setLoading(true);
		setError(false);

		axios
			.get(entries_controller_proxy)
			.then((response) => {
				const parsed_data = parse_bar_chart_data(
					response.data
				).reverse();
				const all_keys = get(response, 'data.labels');
				const highest_form_entry = get(
					response,
					'data.highest_form_entry'
				);
				setData(parsed_data);
				setKeys(all_keys);
				setHeighest(highest_form_entry);
				setLoading(false);
			})
			.catch((error) => {
				console.error(error);
				setLoading(false);
				setError(true);
			});
	};

	useEffect(fetch_data, []);

	return (
		<div className="chart" ref={container} style={{ height: 400 }}>
			{!loading && !error && (
				<ResponsiveBar
					data={data}
					keys={keys}
					indexBy="date"
					margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
					padding={0.3}
					colors={{ scheme: 'nivo' }}
					defs={[
						{
							id: 'dots',
							type: 'patternDots',
							background: 'inherit',
							color: '#38bcb2',
							size: 4,
							padding: 1,
							stagger: true,
						},
						{
							id: 'lines',
							type: 'patternLines',
							background: 'inherit',
							color: '#eed312',
							rotation: -45,
							lineWidth: 6,
							spacing: 10,
						},
					]}
					fill={[
						{
							match: {
								id: 'fries',
							},
							id: 'dots',
						},
						{
							match: {
								id: 'Contact Form',
							},
							id: 'lines',
						},
					]}
					enableGridX={true}
					borderColor={{
						from: 'color',
						modifiers: [['darker', 1.6]],
					}}
					axisTop={null}
					axisRight={null}
					axisBottom={{
						tickSize: 5,
						tickPadding: 5,
						tickRotation: 0,
						legend: 'Date',
						legendPosition: 'middle',
						legendOffset: 32,
					}}
					axisLeft={{
						tickSize: 5,
						tickPadding: 5,
						tickRotation: 0,
						legend: 'Entries',
						legendPosition: 'middle',
						legendOffset: -40,
						tickValues: heighest,
					}}
					labelSkipWidth={12}
					labelSkipHeight={12}
					labelTextColor={{
						from: 'color',
						modifiers: [['darker', 1.6]],
					}}
					legends={[
						{
							dataFrom: 'keys',
							anchor: 'bottom-right',
							direction: 'column',
							justify: false,
							translateX: 120,
							translateY: 0,
							itemsSpacing: 2,
							itemWidth: 100,
							itemHeight: 20,
							itemDirection: 'left-to-right',
							itemOpacity: 0.85,
							symbolSize: 20,
							effects: [
								{
									on: 'hover',
									style: {
										itemOpacity: 1,
									},
								},
							],
						},
					]}
					animate={true}
					motionStiffness={90}
					motionDamping={15}
				/>
			)}
			{loading && !error && (
				<div className="cwp-bar-loader">
					<span>Loading Visual Chart </span>
					<Spinner className="cwp-spin" />
				</div>
			)}
			{error && !loading && (
				<div className="cwp-bar-error">
					<h3>Failed to fetch Visual Chart</h3>
					<Button isDefault onClick={fetch_data}>
						Try Again
					</Button>
				</div>
			)}
		</div>
	);
}

export default BarChart;
