import React, { type ReactElement } from 'react';
import { Chip, Tooltip } from '@mui/material';

interface Props {
	tooltip: string;
	label: string;
	color: string;
}

export default function Component(props: Props): ReactElement {
	return (
		<Tooltip title={props.tooltip}>
			<Chip
				label={props.label}
				color={props.color as any}
				size='small'
				sx={{
					width: '30px',
					height: '30px',
					borderRadius: '2px',
					fontSize: '12px',
				}}
			/>
		</Tooltip>
	);
}
