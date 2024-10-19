import React, { type ReactElement } from 'react';
import { DatePicker, DatePickerProps, DateView } from '@mui/x-date-pickers';

interface Props {
	label: string;
	fullWidth?: boolean;
	views?: DateView[];
}

export default function Component(
	props: Props & DatePickerProps<any>
): ReactElement {
	return (
		<>
			<DatePicker
				disableFuture={props.disableFuture}
				label={props.label}
				views={props.views}
				value={props.value}
				minDate={props.minDate}
				maxDate={props.maxDate}
				onChange={props.onChange}
				sx={props.sx}
				slotProps={{
					textField: {
						InputLabelProps: { shrink: true },
						fullWidth: props.fullWidth ?? true,
						size: 'small',
					},
				}}
			/>
		</>
	);
}
