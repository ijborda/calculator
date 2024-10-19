'use client';

import { Message } from '@mui/icons-material';
import { apiCaller, auth, ownedApi, subject } from '.';

class User {
	constructor() {}

	async updatePhone(params: { phoneNumber: string }) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: '/user/account-recovery-information',
				method: 'POST',
				headers: {
					Authorization: await auth.getToken(),
				},
				data: {
					phone_number: params.phoneNumber,
				},
			});
			return res;
		});
	}

	async resendTemporaryPassword(params: { username: string }) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: '/user/resend-temporary-password',
				method: 'POST',
				headers: {
					Authorization: await auth.getToken(),
				},
				data: {
					username: params.username.toLowerCase(),
				},
			});
			return res;
		});
	}

	async sendEmail(params: { to: string; subject: string; message: string }) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: '/user/email',
				method: 'POST',
				headers: {
					Authorization: await auth.getToken(),
				},
				data: {
					to: params.to,
					subject: params.subject,
					message: params.message,
				},
			});
			return res;
		});
	}
}

export const user = new User();
