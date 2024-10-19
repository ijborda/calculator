import React, { type ReactElement } from 'react';
import { Typography, TypographyProps, colors } from '@mui/material';

interface Props {
	className?: string;
	text: string;
}

export default function Component(
	props: Props & TypographyProps
): ReactElement {
	return (
		<Typography
			variant='subtitle1'
			className={props.className ?? ''}
			sx={{ color: 'text.secondary', ...props.sx }}
		>
			{props.text}
		</Typography>
	);
}
