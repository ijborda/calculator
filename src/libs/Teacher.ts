'use client';

import { APIResponse } from '@/app/interface/interface';
import { apiCaller, auth, ownedApi } from '.';

export interface ITeacher {
	id: string;
	type: string;
	date_added: number;
	given_name: string;
	family_name: string;
	email: string;
	phone_number: string;
	employment_date: string;
	status: 'regular' | 'temporary';
	age: number;
	birthday: string;
	religion: 'catholic' | 'islam';
	gender: 'male' | 'female';
	nationality: string;
	last_school_attended: string;
	bachelors_degree: string;
	masters_degree: string;
	doctorate_degree: string;
	country: string;
	region: string;
	province: string;
	city: string;
	barangay: string;
}

export class Teacher {
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
				url: '/teacher',
				method: 'GET',
				headers: {
					Authorization: await auth.getToken(),
				},
				params: {
					size,
					sort: params?.sort,
					start_primary: 'teacher',
					start_sort: startKey,
				},
			});
			return res as unknown as APIResponse<{
				data: ITeacher[];
				last_key?: {
					date_added: number | string;
					type: string;
				};
				total_pages: number;
				total_items: number;
			}>;
		});
	}

	async getSingle(params: Pick<ITeacher, 'id'>) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: `teacher/${params.id}`,
				method: 'GET',
				headers: {
					Authorization: await auth.getToken(),
				},
				data: params,
			});
			return res as unknown as APIResponse<ITeacher>;
		});
	}

	async post(params: Omit<ITeacher, 'id' | 'date_added' | 'type'>) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: '/teacher',
				method: 'POST',
				headers: {
					Authorization: await auth.getToken(),
				},
				data: params,
			});
			return res as unknown as APIResponse<ITeacher>;
		});
	}

	async update(params: {
		id: string;
		data: Omit<ITeacher, 'id' | 'date_added' | 'type'>;
	}) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: `teacher/${params.id}`,
				method: 'PUT',
				headers: {
					Authorization: await auth.getToken(),
				},
				data: params.data,
			});
			return res as unknown as APIResponse<ITeacher>;
		});
	}

	async delete(params: Pick<ITeacher, 'id'>) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: `teacher/${params.id}`,
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
				url: 'teacher-statistics',
				method: 'GET',
				headers: {
					Authorization: await auth.getToken(),
				},
			});
			return res as unknown as APIResponse<{
				last_updated: number;
				total: number;
				grade_level: number;
				type: 'teacher';
			}>;
		});
	}
}

export const teacher = new Teacher();
