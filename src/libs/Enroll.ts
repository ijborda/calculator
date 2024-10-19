'use client';

import { APIResponse } from '@/app/interface/interface';
import { apiCaller, auth, ownedApi, student } from '.';
import { IStudent } from './Student';

export interface IEnroll extends IStudent {}

export class Enroll {
	constructor() {}

	async get(params?: {
		id?: string;
		size?: number;
		startKey?: number | string;
		sort?: 'asc' | 'desc';
	}) {
		const size = params?.size ?? 10;
		const startKey = params?.startKey;
		// Query enrolled student ids
		const enrolledStudents = await apiCaller.call(async () => {
			const res = await ownedApi({
				url: `/enroll/${params?.id}`,
				method: 'GET',
				headers: {
					Authorization: await auth.getToken(),
				},
				params: {
					size,
					sort: params?.sort,
					start_primary: params?.id,
					start_sort: startKey,
				},
			});
			return res as unknown as APIResponse<{
				data: IStudent[];
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
			data: IStudent[];
			last_key?: {
				type: string;
				date_added: number | string;
			};
			total_pages: number;
			total_items: number;
		}> = {
			status: enrolledStudents.status,
			message: enrolledStudents.message,
			data: {
				data: enrolledStudents.data.data,
				...(enrolledStudents.data.last_key && {
					last_key: {
						type: enrolledStudents.data.last_key.class_id,
						date_added: enrolledStudents.data.last_key.student_id,
					},
				}),
				total_pages: enrolledStudents.data.total_pages,
				total_items: enrolledStudents.data.total_items,
			},
		};
		return response;
	}

	async post(params: { classId: string; studentIds: string[] }) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: `/enroll/${params.classId}`,
				method: 'POST',
				headers: {
					Authorization: await auth.getToken(),
				},
				data: { student_ids: params.studentIds },
			});
			return res as unknown as APIResponse<string[]>;
		});
	}

	async delete(params: { classId: string; studentIds: string[] }) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: `enroll/${params.classId}`,
				method: 'DELETE',
				headers: {
					Authorization: await auth.getToken(),
				},
				data: { student_ids: params.studentIds },
			});
			return res as unknown as APIResponse<string[]>;
		});
	}
}

export const enroll = new Enroll();
