import React, { type ReactElement } from 'react';
import { GridActionsCellItem, GridRowId } from '@mui/x-data-grid';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { Tooltip } from '@mui/material';

interface Props {
	key: GridRowId;
	onClick: (...args: any[]) => Promise<void>;
}

export default function Component(props: Props): ReactElement {
	return (
		<Tooltip title={'Resend Temporary Password'}>
			<GridActionsCellItem
				key={props.key}
				icon={<VpnKeyIcon />}
				label='Resend Temporary Password'
				className='textPrimary'
				onClick={props.onClick}
				color='inherit'
			/>
		</Tooltip>
	);
}
