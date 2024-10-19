import React, { type ReactElement } from 'react';
import { Box, Modal, useTheme } from '@mui/material';

interface Props {
	className?: string;
	maxWidth?: number;
	maxHeight?: number;
	children: React.ReactNode;
	open: boolean;
	onClose: (event: {}) => void;
}

export default function Component(props: Props): ReactElement {
	/**
	 * Declarations
	 */
	const theme = useTheme();

	return (
		<Modal
			open={props.open}
			onClose={props.onClose}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'
		>
			<Box
				sx={{
					position: 'absolute' as 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					maxWidth: props.maxWidth,
					maxHeight: props.maxHeight,
					width: '100%',
					bgcolor: 'background.paper',
					boxShadow: 24,
					textAlign: 'center',
					padding: 6,
					overflowY: 'scroll',
					[theme.breakpoints.down('md')]: {
						padding: 4,
					},
				}}
			>
				{props.children}
			</Box>
		</Modal>
	);
}
