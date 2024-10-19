'use client';

import { APIResponse } from '@/app/interface/interface';
import { apiCaller, auth, ownedApi } from '.';

export interface IReport {
	id: string;
	type: 'report';
	date_added: number;
	class_id: string;
	title: string;
	notes: string;
	file_link: string;
	student_ids: string[];
}

export class Report {
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
				url: `/report-class/${params?.id}`,
				method: 'GET',
				headers: {
					Authorization: await auth.getToken(),
				},
				params: {
					size,
					sort: params?.sort,
					start_primary: 'report',
					start_sort: startKey,
				},
			});
			return res as unknown as APIResponse<{
				data: IReport[];
				last_key?: {
					type: string;
					date_added: number | string;
				};
				total_pages: number;
				total_items: number;
			}>;
		});
	}

	async getAsStudent(params?: {
		size?: number;
		startKey?: number | string;
		sort?: 'asc' | 'desc';
	}) {
		const size = params?.size ?? 10;
		const startKey = params?.startKey;
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: '/student-report',
				method: 'GET',
				headers: {
					Authorization: await auth.getToken(),
				},
				params: {
					size,
					sort: params?.sort,
					start_primary: 'report',
					start_sort: startKey,
				},
			});
			return res as unknown as APIResponse<{
				data: IReport[];
				last_key?: {
					student_id: string;
					date_added: number | string;
				};
				total_pages: number;
				total_items: number;
			}>;
		});
	}

	async getSingle(params: Pick<IReport, 'id'>) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: `report/${params.id}`,
				method: 'GET',
				headers: {
					Authorization: await auth.getToken(),
				},
				data: params,
			});
			return res as unknown as APIResponse<IReport>;
		});
	}

	async post(params: Omit<IReport, 'id' | 'date_added' | 'type'>) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: '/report',
				method: 'POST',
				headers: {
					Authorization: await auth.getToken(),
				},
				data: params,
			});
			return res as unknown as APIResponse<IReport>;
		});
	}

	async update(params: {
		id: string;
		data: Omit<IReport, 'id' | 'date_added' | 'type' | 'class_id'>;
	}) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: `report/${params.id}`,
				method: 'PUT',
				headers: {
					Authorization: await auth.getToken(),
				},
				data: params.data,
			});
			return res as unknown as APIResponse<IReport>;
		});
	}

	async delete(params: Pick<IReport, 'id'>) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: `report/${params.id}`,
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
				url: 'report-statistics',
				method: 'GET',
				headers: {
					Authorization: await auth.getToken(),
				},
			});
			return res as unknown as APIResponse<
				{
					last_updated: number;
					total: number;
					grade_level: number;
					type: 'report';
				}[]
			>;
		});
	}
}

export const report = new Report();
