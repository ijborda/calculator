import React, { type ReactElement } from 'react';
import Paper, { PaperProps } from '@mui/material/Paper';
import { useTheme } from '@mui/material';

interface Props {
	className?: string;
	maxWidth?: string;
	minWidth?: string;
	width?: string;
	height?: string;
	paddingBase?: number;
}

export default function Component(props: Props & PaperProps): ReactElement {
	/**
	 * Declarations
	 */
	const theme = useTheme();

	return (
		<Paper
			sx={{
				padding: props.paddingBase ? props.paddingBase : 6,
				[theme.breakpoints.down('md')]: {
					padding: props.paddingBase ? props.paddingBase * 0.67 : 4,
				},
				[theme.breakpoints.down('sm')]: {
					padding: props.paddingBase ? props.paddingBase * 0.33 : 2,
				},
				maxWidth: props.maxWidth,
				minWidth: props.minWidth,
				width: props.width,
				height: props.height,
			}}
		>
			{props.children}
		</Paper>
	);
}
