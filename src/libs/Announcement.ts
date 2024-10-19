'use client';

import { APIResponse } from '@/app/interface/interface';
import { apiCaller, auth, ownedApi } from '.';

export class Announcement {
	constructor() {}

	async get(params?: {
		id?: string;
		size?: number;
		startKey?: number | string;
		sort?: 'asc' | 'desc';
	}) {
		const size = params?.size ?? 2;
		const startKey = params?.startKey;
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: '/announcement',
				method: 'GET',
				headers: {
					Authorization: await auth.getToken(),
				},
				params: {
					size,
					sort: params?.sort,
					start_primary: 'announcement',
					start_sort: startKey,
				},
			});
			return res as unknown as APIResponse<{
				data: {
					id: string;
					admin_id: string;
					content: string;
					date_added: number;
					subject: string;
					type: string;
				}[];
				last_key?: {
					date_added: number | string;
					type: string;
				};
				total_pages: number;
				total_items: number;
			}>;
		});
	}

	async post(params: { subject: string; content: string }) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: '/announcement',
				method: 'POST',
				headers: {
					Authorization: await auth.getToken(),
				},
				data: {
					subject: params.subject,
					content: params.content,
				},
			});
			return res as unknown as APIResponse<{
				id: string;
				type: string;
				date_added: number;
				admin_id: string;
				subject: string;
				content: string;
			}>;
		});
	}
}

export const announcement = new Announcement();
