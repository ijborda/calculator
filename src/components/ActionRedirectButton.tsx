import React, { type ReactElement } from 'react';
import { GridActionsCellItem, GridRowId } from '@mui/x-data-grid';
import LaunchIcon from '@mui/icons-material/Launch';
import { Tooltip } from '@mui/material';

interface Props {
	key: GridRowId;
	onClick: (...args: any[]) => Promise<void>;
	label?: string;
}

export default function Component(props: Props): ReactElement {
	return (
		<Tooltip title={props.label ?? 'Redirect'}>
			<GridActionsCellItem
				key={props.key}
				icon={<LaunchIcon />}
				label={props.label ?? 'Redirect'}
				className='textPrimary'
				onClick={props.onClick}
				color='inherit'
			/>
		</Tooltip>
	);
}
