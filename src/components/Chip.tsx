import React, { type ReactElement } from 'react';
import { Chip } from '@mui/material';

interface Props {
	color: string;
	label: string;
}

export default function Component(props: Props): ReactElement {
	return <Chip color={props.color as any} label={props.label} />;
}
