import React, { type ReactElement } from 'react';
import { Stack, StackOwnProps, Theme, useMediaQuery } from '@mui/material';

type flexOptions =
	| 'center'
	| 'end'
	| 'start'
	| 'space-around'
	| 'space-between'
	| 'space-evenly'
	| 'stretch';

interface Props {
	spacing?: number;
	horizontalSpacing?: flexOptions;
	verticalSpacing?: flexOptions;
	rotateOnSmall?: {
		spacing: number;
	};
	useFlexGap?: boolean;
}

export default function Component(props: Props & StackOwnProps): ReactElement {
	/**
	 * Declarations
	 */
	const isLessThanSmScreen = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down('sm')
	);

	return isLessThanSmScreen && props.rotateOnSmall ? (
		<Stack
			direction='column'
			alignItems={props.verticalSpacing ?? 'start'}
			justifyContent={props.horizontalSpacing ?? 'center'}
			spacing={props.rotateOnSmall?.spacing}
			sx={props.sx}
			useFlexGap={props.useFlexGap}
		>
			{props.children}
		</Stack>
	) : (
		<Stack
			direction='row'
			alignItems={props.verticalSpacing ?? 'center'}
			justifyContent={props.horizontalSpacing ?? 'start'}
			spacing={props.spacing}
			sx={props.sx}
			useFlexGap={props.useFlexGap}
		>
			{props.children}
		</Stack>
	);
}
