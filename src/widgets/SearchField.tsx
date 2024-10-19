import React, { type ReactElement } from 'react';
import { InputAdornment, TextFieldProps } from '@mui/material';
import { GridSearchIcon } from '@mui/x-data-grid';
import { TextField } from '@/components';

interface Props {
	className?: string;
}

export default function Widget(props: Props & TextFieldProps): ReactElement {
	return (
		// <TextField
		// 	className={props.className ?? ''}
		// 	label='Search'
		// 	type='text'
		// 	size='small'
		// 	fullWidth={false}
		// 	InputProps={{
		// 		startAdornment: (
		// 			<InputAdornment position='start'>
		// 				<GridSearchIcon color='disabled' />
		// 			</InputAdornment>
		// 		),
		// 	}}
		// />
		<></>
	);
}
