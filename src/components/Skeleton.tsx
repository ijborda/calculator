import React, { type ReactElement } from 'react';
import { Skeleton } from '@mui/material';
import { StackVertical } from '.';

interface Props {
	className?: string;
}

export default function Component(props: Props): ReactElement {
	return (
		<StackVertical spacing={2}>
			<Skeleton width='100%' height='128px' variant='rounded'></Skeleton>
			<Skeleton width='100%' height='128px' variant='rounded'></Skeleton>
			<Skeleton width='100%' height='128px' variant='rounded'></Skeleton>
			<Skeleton width='100%' height='128px' variant='rounded'></Skeleton>
			<Skeleton width='100%' height='128px' variant='rounded'></Skeleton>
		</StackVertical>
	);
}
