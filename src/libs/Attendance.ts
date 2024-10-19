'use client';

import { APIResponse } from '@/app/interface/interface';
import { apiCaller, auth, ownedApi } from '.';
import { ICourse } from './Course';

export interface IAttendance {
	class_id: string;
	student_id: string;
	student_name: string;
	date_added: number;
	// Contains also the attendance data
	// Example:  "012024":[0,0,0,0...,1]
	[key: string]: string | number | number[];
}

export class Attendance {
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
				url: `/attendance/${params?.id}`,
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
				data: {
					class_id: string;
					student_id: string;
					student_name: string;
					[key: string]: string | number[];
				}[];
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
			data: {
				class_id: string;
				student_id: string;
				student_name: string;
				date_added: number;
				[key: string]: string | number | number[];
			}[];
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
		const studentMonthYear = params?.id;
		const [studentId, month, year] = (studentMonthYear || '')?.split('.');
		const size = params?.size ?? 10;
		const startKey = params?.startKey;
		const res = await apiCaller.call(async () => {
			return (await ownedApi({
				url: `/student-attendance/${month}.${year}`,
				method: 'GET',
				headers: {
					Authorization: await auth.getToken(),
				},
				params: {
					size,
					sort: params?.sort,
					start_primary: startKey,
					start_sort: studentId,
				},
			})) as unknown as APIResponse<{
				data: (ICourse & Omit<IAttendance, 'student_name'>)[];
				last_key?: {
					class_id: string;
					student_id: number | string;
				};
				total_pages: number;
				total_items: number;
			}>;
		});
		const resWithDateAdded: APIResponse<{
			data: (ICourse & Omit<IAttendance, 'student_name'>)[];
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
		id: string;
		data: { student_id: string; attendance: number[] }[];
	}) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: `/attendance/${params.id}`,
				method: 'PUT',
				headers: {
					Authorization: await auth.getToken(),
				},
				data: { data: params.data },
			});
			return res as unknown as APIResponse<{
				classIdMonthYear: string;
				newValues: {
					data: { student_id: string; attendance: number[] }[];
				};
			}>;
		});
	}

	async getStatistics() {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: 'attendance-statistics',
				method: 'GET',
				headers: {
					Authorization: await auth.getToken(),
				},
			});
			return res as unknown as APIResponse<
				{
					last_updated: number;
					present: number;
					total: number;
					grade_level: number;
					type: 'attendance';
				}[]
			>;
		});
	}
}

export const attendance = new Attendance();
