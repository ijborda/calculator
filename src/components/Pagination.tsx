import React, { type ReactElement } from 'react';
import { Pagination, PaginationProps } from '@mui/material';

interface Props {
	count?: number;
}

export default function Component(
	props: Props & PaginationProps
): ReactElement {
	/**
	 * Declarations
	 */
	return (
		<Pagination
			count={props.count}
			onChange={props.onChange}
			shape='rounded'
			color='primary'
			siblingCount={0}
		/>
	);
}
