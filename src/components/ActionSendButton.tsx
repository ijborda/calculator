import React, { type ReactElement } from 'react';
import { GridActionsCellItem, GridRowId } from '@mui/x-data-grid';
import SendIcon from '@mui/icons-material/Send';
import { Tooltip } from '@mui/material';

interface Props {
	key: GridRowId;
	onClick: (...args: any[]) => Promise<void>;
	label?: string;
}

export default function Component(props: Props): ReactElement {
	return (
		<Tooltip title={props.label ?? 'Send'}>
			<GridActionsCellItem
				key={props.key}
				icon={<SendIcon />}
				label={props.label ?? 'Send'}
				className='textPrimary'
				onClick={props.onClick}
				color='inherit'
			/>
		</Tooltip>
	);
}
