'use client';

import { APIResponse } from '@/app/interface/interface';
import { apiCaller, auth, ownedApi } from '.';
import { IEnroll } from './Enroll';
import { ICourse } from './Course';

export interface IGrade {
	class_id: string;
	student_id: string;
	student_name: string;
	first_quarter_grade?: number;
	second_quarter_grade?: number;
}

export class Grade {
	constructor() {}

	async get(params?: {
		id?: string;
		size?: number;
		startKey?: number | string;
		sort?: 'asc' | 'desc';
	}) {
		const size = params?.size ?? 10;
		const startKey = params?.startKey;
		const res = await apiCaller.call(async () => {
			return (await ownedApi({
				url: `/grade/${params?.id}`,
				method: 'GET',
				headers: {
					Authorization: await auth.getToken(),
				},
				params: {
					size,
					sort: params?.sort,
					start_primary: (params?.id as any).split('.')[0],
					start_sort: startKey,
				},
			})) as unknown as APIResponse<{
				data: IGrade[];
				last_key?: {
					class_id: string;
					student_id: string;
				};
				total_pages: number;
				total_items: number;
			}>;
		});
		// Arrange return
		const response: APIResponse<{
			data: (IGrade & { date_added: number })[];
			last_key?: {
				type: string;
				date_added: number | string;
			};
			total_pages: number;
			total_items: number;
		}> = {
			status: res.status,
			message: res.message,
			data: {
				data: res.data.data.map((d) => {
					return {
						...d,
						date_added: 0,
					};
				}),
				...(res.data.last_key && {
					last_key: {
						type: res.data.last_key.class_id,
						date_added: res.data.last_key.student_id,
					},
				}),
				total_pages: res.data.total_pages,
				total_items: res.data.total_items,
			},
		};
		return response;
	}

	async getAsStudent(params?: {
		id?: string;
		size?: number;
		startKey?: number | string;
		sort?: 'asc' | 'desc';
	}) {
		const size = params?.size ?? 10;
		const startKey = params?.startKey;
		const res = await apiCaller.call(async () => {
			return (await ownedApi({
				url: '/student-grade',
				method: 'GET',
				headers: {
					Authorization: await auth.getToken(),
				},
				params: {
					size,
					sort: params?.sort,
					start_primary: startKey,
					start_sort: params?.id,
				},
			})) as unknown as APIResponse<{
				data: (ICourse & Omit<IGrade, 'student_name'>)[];
				last_key?: {
					class_id: string;
					student_id: number | string;
				};
				total_pages: number;
				total_items: number;
			}>;
		});
		const resWithDateAdded: APIResponse<{
			data: (ICourse & Omit<IGrade, 'student_name'>)[];
			last_key?: {
				class_id: string;
				date_added: number | string;
			};
			total_pages: number;
			total_items: number;
		}> = {
			status: res.status,
			message: res.message,
			data: {
				data: res.data.data.map((d) => {
					return {
						...d,
						date_added: 0,
					};
				}),
				...(res.data.last_key && {
					last_key: {
						class_id: res.data.last_key.class_id,
						date_added: res.data.last_key.student_id,
					},
				}),
				total_pages: res.data.total_pages,
				total_items: res.data.total_items,
			},
		};
		return resWithDateAdded;
	}

	async update(params: {
		classId: string;
		data: Omit<IGrade, 'student_name' | 'class_id'>[];
	}) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: `/grade/${params.classId}`,
				method: 'PUT',
				headers: {
					Authorization: await auth.getToken(),
				},
				data: { data: params.data },
			});
			return res as unknown as APIResponse<{
				class_Id: string;
				newValues: Omit<IGrade, 'student_name' | 'class_id'>[];
			}>;
		});
	}

	async getStatistics() {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: 'grade-statistics',
				method: 'GET',
				headers: {
					Authorization: await auth.getToken(),
				},
			});
			return res as unknown as APIResponse<
				{
					last_updated: number;
					grade_sum: number;
					grade_num: number;
					grade_level: number;
					type: 'grade';
				}[]
			>;
		});
	}
}

export const grade = new Grade();
