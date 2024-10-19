import React, { type ReactElement } from 'react';
import { ButtonText } from '@/components';

interface Props {
	className?: string;
	icon: React.ReactNode;
	text: string;
}

export default function Widget(props: Props): ReactElement {
	return (
		<ButtonText>
			{props.icon} {props.text}
		</ButtonText>
	);
}
