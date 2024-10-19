'use client';

import { APIResponse } from '@/app/interface/interface';
import { apiCaller, auth, ownedApi } from '.';

export interface ISubject {
	id: string;
	type: 'subject';
	date_added: number;
	grade_level: number;
	name: string;
	description: string;
}

export class Subject {
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
				url: '/subject',
				method: 'GET',
				headers: {
					Authorization: await auth.getToken(),
				},
				params: {
					size,
					sort: params?.sort,
					start_primary: 'subject',
					start_sort: startKey,
				},
			});
			return res as unknown as APIResponse<{
				data: ISubject[];
				last_key?: {
					date_added: number | string;
					type: string;
				};
				total_pages: number;
				total_items: number;
			}>;
		});
	}

	async getSingle(params: Pick<ISubject, 'id'>) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: `subject/${params.id}`,
				method: 'GET',
				headers: {
					Authorization: await auth.getToken(),
				},
				data: params,
			});
			return res as unknown as APIResponse<ISubject>;
		});
	}

	async post(params: Omit<ISubject, 'id' | 'date_added' | 'type'>) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: '/subject',
				method: 'POST',
				headers: {
					Authorization: await auth.getToken(),
				},
				data: params,
			});
			return res as unknown as APIResponse<ISubject>;
		});
	}

	async update(params: {
		id: string;
		data: Omit<ISubject, 'id' | 'date_added' | 'type'>;
	}) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: `subject/${params.id}`,
				method: 'PUT',
				headers: {
					Authorization: await auth.getToken(),
				},
				data: params.data,
			});
			return res as unknown as APIResponse<ISubject>;
		});
	}

	async delete(params: Pick<ISubject, 'id'>) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: `subject/${params.id}`,
				method: 'DELETE',
				headers: {
					Authorization: await auth.getToken(),
				},
				data: params,
			});
			return res as unknown as APIResponse<{}>;
		});
	}

	async getStatistics() {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: 'subject-statistics',
				method: 'GET',
				headers: {
					Authorization: await auth.getToken(),
				},
			});
			return res as unknown as APIResponse<{
				last_updated: number;
				total: number;
				grade_level: number;
				type: 'subject';
			}>;
		});
	}
}

export const subject = new Subject();
