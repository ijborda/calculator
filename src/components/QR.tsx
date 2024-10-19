import React, { type ReactElement } from 'react';
import QRCode from 'react-qr-code';

interface Props {
	value: string;
	size?: number;
}

export default function Component(props: Props): ReactElement {
	return (
		<>
			<QRCode
				size={props.size ?? 200}
				value={props.value}
				viewBox={`0 0 256 256`}
			/>
		</>
	);
}
