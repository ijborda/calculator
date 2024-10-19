import { ButtonProps, Button } from '@mui/material';
import React, { type ReactElement } from 'react';

interface Props {
	className?: string;
}

export default function Component(props: Props & ButtonProps): ReactElement {
	return (
		<>
			<Button
				className={props.className ?? ''}
				variant={props.variant ?? 'contained'}
				size={props.size ?? 'large'}
				onClick={props.onClick}
				sx={props.sx}
				href={props.href}
			>
				{props.children}
			</Button>
		</>
	);
}
