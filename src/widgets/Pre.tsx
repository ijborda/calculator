import React, { type ReactElement } from 'react';
// import Loading from '@/widgets/shared/Loading';
// import Toast from '@/components/ToastCustom';

interface Props {
	title: string;
	isLoading?: boolean;
}

export default function Widget({ isLoading }: Props): ReactElement {
	return (
		<>
			{/* <Toast /> */}
			{/* {isLoading && <Loading />} */}
		</>
	);
}
