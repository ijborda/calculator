import React, { type ReactElement } from 'react';
import { GridActionsCellItem, GridRowId } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Tooltip } from '@mui/material';

interface Props {
	key: GridRowId;
	onClick: (...args: any[]) => Promise<void>;
	label?: string;
}

export default function Component(props: Props): ReactElement {
	return (
		<Tooltip title={props.label ?? 'View'}>
			<GridActionsCellItem
				key={props.key}
				icon={<VisibilityIcon />}
				label={props.label ?? 'View'}
				className='textPrimary'
				onClick={props.onClick}
				color='inherit'
			/>
		</Tooltip>
	);
}
