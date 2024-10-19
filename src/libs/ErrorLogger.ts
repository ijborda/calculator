'use client';

import { UIError, auth } from '.';

class ErrorLogger {
	async call<T>(fn: (...args: any[]) => Promise<T>) {
		try {
			return await fn();
		} catch (err: unknown) {
			if (err instanceof UIError && err.allowLog === true) {
				console.log(err);
			}
			if (err instanceof Error) {
				if (
					err.name === 'UserUnAuthenticatedException' ||
					err.name === 'UserNotFoundException'
				) {
					await auth.logout();
					window.location.replace('/login');
				}
			}
			return;
		}
	}
}

export const errorLogger = new ErrorLogger();
