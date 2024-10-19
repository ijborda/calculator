import React, { type ReactElement } from 'react';
import { Typography } from '@mui/material';

interface Props {
	className?: string;
	title: string;
}

export default function Component(props: Props): ReactElement {
	return (
		<Typography variant='h4' className={props.className ?? ''}>
			{props.title}
		</Typography>
	);
}
