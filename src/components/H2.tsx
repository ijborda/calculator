import React, { type ReactElement } from 'react';
import { Typography, TypographyProps } from '@mui/material';

interface Props {
	className?: string;
	title: string;
}

export default function Component(
	props: Props & TypographyProps
): ReactElement {
	return (
		<Typography variant='h2' className={props.className ?? ''} sx={props.sx}>
			{props.title}
		</Typography>
	);
}
