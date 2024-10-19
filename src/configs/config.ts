const raise = (envValue: string | undefined): string => {
	if (envValue === undefined || envValue === '') {
		throw new Error('Not found on the environment.');
	}
	return envValue;
};

export const config = {
	cognito: {
		region: raise(process.env.NEXT_PUBLIC_COGNITO_REGION),
		userPoolId: raise(process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID),
		appClientId: raise(process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID),
	},
	api: {
		baseUrl: raise(process.env.NEXT_PUBLIC_API_BASEURL),
	},
};
