import { ButtonProps, Button } from '@mui/material';
import React, { type ReactElement } from 'react';

interface Props {
	className?: string;
}

export default function Component(props: Props & ButtonProps): ReactElement {
	return (
		<div>
			<Button
				className={props.className ?? ''}
				variant='text'
				size={props.size ?? 'large'}
				onClick={props.onClick}
				sx={{
					textTransform: 'none',
					fontWeight: '0',
				}}
			>
				{props.children}
			</Button>
		</div>
	);
}
