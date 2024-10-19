import React, { type ReactElement } from 'react';
import { MenuItem, TextField, TextFieldProps } from '@mui/material';

interface Props {
	className?: string;
	options: { value: string | number; label: string | number | boolean }[];
}

export default function Component(props: Props & TextFieldProps): ReactElement {
	return (
		<>
			<TextField
				className={props.className ?? ''}
				id={props.id}
				label={props.label}
				select
				variant={props.variant ?? 'outlined'}
				size={props.size ?? 'small'}
				fullWidth={props.fullWidth ?? true}
				InputLabelProps={{
					shrink: true,
				}}
				InputProps={props.InputProps}
				margin='none'
				sx={{ ...props.sx, textAlign: 'left' }}
				defaultValue={props.defaultValue || ''}
				value={
					typeof props.value === 'string'
						? props.value.toLowerCase()
						: props.value
				}
				onChange={props.onChange}
			>
				{props.options.map((option) => (
					<MenuItem key={option.value} value={option.value}>
						{option.label}
					</MenuItem>
				))}
			</TextField>
		</>
	);
}
