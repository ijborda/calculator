import React, { type ReactElement } from 'react';
import { Stack, StackOwnProps, SxProps, Theme } from '@mui/material';

type flexOptions =
	| 'center'
	| 'end'
	| 'start'
	| 'space-around'
	| 'space-between'
	| 'space-evenly'
	| 'stretch';

interface Props {
	children: React.ReactNode;
	spacing?: number;
	horizontalSpacing?: flexOptions;
	verticalSpacing?: flexOptions;
	sx?: SxProps<Theme>;
	useFlexGap?: boolean;
}

export default function Component(props: Props): ReactElement {
	return (
		<Stack
			direction='column'
			alignItems={props.horizontalSpacing ?? 'start'}
			justifyContent={props.verticalSpacing ?? 'center'}
			spacing={props.spacing}
			sx={props.sx}
			useFlexGap={props.useFlexGap}
		>
			{props.children}
		</Stack>
	);
}
