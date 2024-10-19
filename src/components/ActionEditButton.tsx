import React, { type ReactElement } from 'react';
import { GridActionsCellItem, GridRowId } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { Tooltip } from '@mui/material';

interface Props {
	key: GridRowId;
	onClick: (...args: any[]) => Promise<void>;
	label?: string;
}

export default function Component(props: Props): ReactElement {
	return (
		<Tooltip title={props.label ?? 'Edit'}>
			<GridActionsCellItem
				key={props.key}
				icon={<EditIcon />}
				label={props.label ?? 'Edit'}
				className='textPrimary'
				onClick={props.onClick}
				color='inherit'
			/>
		</Tooltip>
	);
}
