import React, { type ReactElement } from 'react';
import { LoadingButton, LoadingButtonProps } from '@mui/lab';

interface Props {
	className?: string;
}

export default function Component(
	props: Props & LoadingButtonProps
): ReactElement {
	return (
		<>
			<LoadingButton
				className={props.className ?? ''}
				variant={props.variant ?? 'contained'}
				size={props.size ?? 'large'}
				loading={props.loading}
				loadingPosition={props.loadingPosition ?? 'center'}
				onClick={props.onClick}
				disabled={props.disabled}
			>
				{props.children}
			</LoadingButton>
		</>
	);
}
