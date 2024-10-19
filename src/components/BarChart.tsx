import React, { type ReactElement } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart, Bar } from 'react-chartjs-2';
ChartJS.register(...registerables);

interface Props {
	labels: string[];
	data: number[];
	chartTitle: string;
}

export default function Component(props: Props): ReactElement {
	return (
		<Bar
			data={{
				labels: props.labels,
				datasets: [
					{
						data: props.data,
						borderWidth: 1,
						backgroundColor: '#c6282899',
						borderColor: '#c62828',
					},
				],
			}}
			options={{
				plugins: {
					legend: { display: false },
					title: {
						display: true,
						text: props.chartTitle,
					},
				},
			}}
		/>
	);
}
