import React, { type ReactElement } from 'react';
import { GridActionsCellItem, GridRowId } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip } from '@mui/material';

interface Props {
	key: GridRowId;
	onClick: (...args: any[]) => Promise<void>;
	label?: string;
}

export default function Component(props: Props): ReactElement {
	return (
		<Tooltip title={props.label ?? 'Delete'}>
			<GridActionsCellItem
				key={props.key}
				icon={<DeleteIcon />}
				label={props.label ?? 'Delete'}
				className='textPrimary'
				onClick={props.onClick}
				color='inherit'
			/>
		</Tooltip>
	);
}
