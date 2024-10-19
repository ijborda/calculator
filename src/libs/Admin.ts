'use client';

import { APIResponse } from '@/app/interface/interface';
import { apiCaller, auth, ownedApi } from '.';

export interface IAdmin {
	id: string;
	type: string;
	date_added: number;
	username: string;
	given_name: string;
	family_name: string;
	email: string;
	phone_number: string;
	account_status: string;
	user_type: 'admin';
	position: string;
	access_students: number;
	access_teachers: number;
	access_admins: number;
	access_classes: number;
	access_subjects: number;
	access_announcements: number;
}

export class Admin {
	constructor() {}

	async get(params?: {
		id?: string;
		size?: number;
		startKey?: number | string;
		sort?: 'asc' | 'desc';
	}) {
		const size = params?.size ?? 10;
		const startKey = params?.startKey;
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: '/admin',
				method: 'GET',
				headers: {
					Authorization: await auth.getToken(),
				},
				params: {
					size,
					sort: params?.sort,
					start_primary: 'admin',
					start_sort: startKey,
				},
			});
			return res as unknown as APIResponse<{
				data: IAdmin[];
				last_key?: {
					date_added: number | string;
					type: string;
				};
				total_pages: number;
				total_items: number;
			}>;
		});
	}

	async getSingle(params: Pick<IAdmin, 'id'>) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: `admin/${params.id}`,
				method: 'GET',
				headers: {
					Authorization: await auth.getToken(),
				},
				data: params,
			});
			return res as unknown as APIResponse<IAdmin>;
		});
	}

	async post(
		params: Omit<
			IAdmin,
			'id' | 'date_added' | 'type' | 'user_type' | 'account_status'
		>
	) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: '/admin',
				method: 'POST',
				headers: {
					Authorization: await auth.getToken(),
				},
				data: params,
			});
			return res as unknown as APIResponse<IAdmin>;
		});
	}

	async update(params: {
		id: string;
		data: Omit<
			IAdmin,
			'id' | 'date_added' | 'type' | 'user_type' | 'account_status'
		>;
	}) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: `admin/${params.id}`,
				method: 'PUT',
				headers: {
					Authorization: await auth.getToken(),
				},
				data: params.data,
			});
			return res as unknown as APIResponse<IAdmin>;
		});
	}

	async delete(params: Pick<IAdmin, 'id'>) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: `admin/${params.id}`,
				method: 'DELETE',
				headers: {
					Authorization: await auth.getToken(),
				},
				data: params,
			});
			return res as unknown as APIResponse<{}>;
		});
	}
}

export const admin = new Admin();
