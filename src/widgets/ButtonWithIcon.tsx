import React, { type ReactElement } from 'react';
import { ButtonProps, Stack, Theme, useMediaQuery } from '@mui/material';
import { Button, Subtitle } from '@/components';

interface Props {
	className?: string;
	icon: React.ReactNode;
	text: string;
}

export default function Widget(props: Props & ButtonProps): ReactElement {
	/**
	 * Declarations
	 */
	const isLessThanMdScreen = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down('md')
	);

	return (
		<Button
			size='large'
			sx={{
				height: 'fit-content',
			}}
			onClick={props.onClick}
		>
			<Stack direction='row' spacing={1}>
				{props.icon}
				{!isLessThanMdScreen && (
					<Subtitle
						text={props.text}
						sx={{ color: 'common.white', fontWeight: 500 }}
					/>
				)}
			</Stack>
		</Button>
	);
}
