import React, { type ReactElement } from 'react';
import { Typography } from '@mui/material';

interface Props {
	className?: string;
	text: string;
}

export default function Component(props: Props): ReactElement {
	return (
		<Typography fontSize='h4.fontSize' className={props.className ?? ''}>
			{props.text}
		</Typography>
	);
}
