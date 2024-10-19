'use client';

import { APIResponse } from '@/app/interface/interface';
import { apiCaller, auth, ownedApi } from '.';

export interface ICourse {
	id: string;
	type: string;
	date_added: number;
	name: string;
	teacher_id: string;
	subject_id: string;
	schedule: string;
}

export class Course {
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
				url: '/class',
				method: 'GET',
				headers: {
					Authorization: await auth.getToken(),
				},
				params: {
					size,
					sort: params?.sort,
					start_primary: 'class',
					start_sort: startKey,
				},
			});
			return res as unknown as APIResponse<{
				data: ICourse[];
				last_key?: {
					date_added: number | string;
					type: string;
				};
				total_pages: number;
				total_items: number;
			}>;
		});
	}

	async getSingle(params: Pick<ICourse, 'id'>) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: `class/${params.id}`,
				method: 'GET',
				headers: {
					Authorization: await auth.getToken(),
				},
				data: params,
			});
			return res as unknown as APIResponse<ICourse>;
		});
	}

	async post(params: Omit<ICourse, 'id' | 'date_added' | 'type'>) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: '/class',
				method: 'POST',
				headers: {
					Authorization: await auth.getToken(),
				},
				data: params,
			});
			return res as unknown as APIResponse<ICourse>;
		});
	}

	async update(params: {
		id: string;
		data: Omit<ICourse, 'id' | 'date_added' | 'type'>;
	}) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: `class/${params.id}`,
				method: 'PUT',
				headers: {
					Authorization: await auth.getToken(),
				},
				data: params.data,
			});
			return res as unknown as APIResponse<ICourse>;
		});
	}

	async delete(params: Pick<ICourse, 'id'>) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: `class/${params.id}`,
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
				url: 'class-statistics',
				method: 'GET',
				headers: {
					Authorization: await auth.getToken(),
				},
			});
			return res as unknown as APIResponse<{
				last_updated: number;
				total: number;
				type: 'class';
			}>;
		});
	}
}

export const course = new Course();
