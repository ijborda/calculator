'use client';

import { Amplify } from 'aws-amplify';
import {
	type SignInInput,
	signIn,
	SignInOutput,
	confirmSignIn,
	ConfirmSignInOutput,
	getCurrentUser,
	signOut,
	AuthError,
	fetchUserAttributes,
	FetchUserAttributesOutput,
	updatePassword,
	fetchMFAPreference,
	FetchMFAPreferenceOutput,
	setUpTOTP,
	SetUpTOTPOutput,
	verifyTOTPSetup,
	updateMFAPreference,
	fetchAuthSession,
	resetPassword,
	ResetPasswordOutput,
	confirmResetPassword,
} from '@aws-amplify/auth';
import { config } from '@/configs/config';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import { UIError, apiCaller } from '.';

class Auth {
	private sessionTokenName = 'sessionToken';
	// private user:

	constructor(params: { userpoolId: string; userPoolClientId: string }) {
		Amplify.configure({
			Auth: {
				Cognito: {
					userPoolClientId: params.userPoolClientId,
					userPoolId: params.userpoolId,
				},
			},
		});
	}

	async signin({ username, password }: SignInInput) {
		return apiCaller.call<SignInOutput>(async () => {
			try {
				return await signIn({ username, password });
			} catch (err) {
				if (
					err instanceof Error &&
					err.message === 'There is already a signed in user.'
				) {
					await this.logout();
					return await signIn({ username, password });
				}
				throw err;
			}
		});
	}

	async updateTemporaryPassword(newPassword: string) {
		return apiCaller.call<ConfirmSignInOutput>(async () => {
			return await confirmSignIn({ challengeResponse: newPassword });
		});
	}

	async sendMfaCode(code: string) {
		return apiCaller.call<ConfirmSignInOutput>(async () => {
			let res: ConfirmSignInOutput;
			try {
				res = await confirmSignIn({ challengeResponse: code });
			} catch (err) {
				if (err instanceof AuthError) {
					switch (err.name) {
						case 'CodeMismatchException':
							throw new UIError('Invalid code. Please try again.');
						default:
							throw err;
					}
				} else {
					throw err;
				}
			}
			await this.setSessionTokens();
			return res;
		});
	}

	async logout() {
		return apiCaller.call<void>(async () => {
			await signOut();
			this.clearSessionTokens();
		});
	}

	async logOutAllSession() {
		return apiCaller.call<void>(async () => {
			await signOut({ global: true });
			this.clearSessionTokens();
		});
	}

	isAuthenticated(): boolean {
		const token = getCookie(this.sessionTokenName);
		if (!token || token === '') {
			return false;
		}
		return true;
	}

	async getUser() {
		return apiCaller.call<FetchUserAttributesOutput & { username: string }>(
			async () => {
				const username = getCookie(this.sessionTokenName);
				const res = await fetchUserAttributes();
				return { ...res, username } as FetchUserAttributesOutput & {
					username: string;
				};
			}
		);
	}

	public changePassword = async (params: {
		oldPassword: string;
		newPassword: string;
	}) => {
		return apiCaller.call<void>(async () => {
			return await updatePassword({
				oldPassword: params.oldPassword,
				newPassword: params.newPassword,
			});
		});
	};

	public forgotPassword = async (params: { username: string }) => {
		return apiCaller.call<ResetPasswordOutput>(async () => {
			return await resetPassword({ username: params.username });
		});
	};

	public confirmForgotPassword = async (params: {
		username: string;
		code: string;
		newPassword: string;
	}) => {
		return apiCaller.call<void>(async () => {
			return await confirmResetPassword({
				username: params.username,
				confirmationCode: params.code,
				newPassword: params.newPassword,
			});
		});
	};

	public getMfaPref = async () => {
		return apiCaller.call<FetchMFAPreferenceOutput>(async () => {
			return await fetchMFAPreference();
		});
	};

	public setUpAuthApp = async () => {
		return apiCaller.call<SetUpTOTPOutput>(async () => {
			return await setUpTOTP();
		});
	};

	public verifyAuthAppSetup = async (params: { code: string }) => {
		return apiCaller.call<void>(async () => {
			await verifyTOTPSetup({ code: params.code });
		});
	};

	public markAuthAppAsPreferred = async () => {
		return apiCaller.call<void>(
			async () => {
				await updateMFAPreference({ sms: 'DISABLED', totp: 'ENABLED' });
			},
			{ showToast: false }
		);
	};

	public markSmsAsPreferred = async () => {
		return apiCaller.call<void>(
			async () => {
				await updateMFAPreference({ sms: 'ENABLED', totp: 'DISABLED' });
			},
			{ showToast: false }
		);
	};

	public getToken = async () => {
		return apiCaller.call<string | undefined>(async () => {
			const res = await fetchAuthSession();
			return res.tokens?.idToken?.toString();
		});
	};

	private setSessionTokens = async () => {
		const user = await getCurrentUser();
		setCookie(this.sessionTokenName, user.username);
	};

	private clearSessionTokens = async () => {
		deleteCookie(this.sessionTokenName);
	};
}

export const auth = new Auth({
	userpoolId: config.cognito.userPoolId,
	userPoolClientId: config.cognito.appClientId,
});
