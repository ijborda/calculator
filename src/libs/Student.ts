'use client';

import { APIResponse } from '@/app/interface/interface';
import { apiCaller, auth, ownedApi } from '.';

export interface IStudent {
	username: string;
	given_name: string;
	family_name: string;
	email: string;
	phone_number: string;
	account_status: string;
	user_type: 'student';
	position: 'student';
	guardian_name: string;
	pending_behavioral_case: boolean;
	father_name: string;
	mother_email: string;
	status: string;
	mother_phone: string;
	blood_type: string;
	standing: string;
	country: string;
	postal_code: string;
	city: string;
	religion: string;
	father_occupation: string;
	mother_name: string;
	father_phone: string;
	guardian_phone: string;
	province: string;
	allergies: string;
	health_conditions: string;
	grade_level: number;
	region: string;
	id: string;
	street_name: string;
	guardian_address: string;
	adviser_id: string;
	age: number;
	nationality: string;
	guardian_occupation: string;
	barangay: string;
	guardian_relationship: string;
	gender: string;
	height_cm: number;
	guardian_email: string;
	weight_kg: number;
	date_added: number;
	father_email: string;
	mother_occupation: string;
	date_admission: number;
	date_graduation: string;
	birthday: string;
	type: 'student';
}

export class Student {
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
				url: '/student',
				method: 'GET',
				headers: {
					Authorization: await auth.getToken(),
				},
				params: {
					size,
					sort: params?.sort,
					start_primary: 'student',
					start_sort: startKey,
				},
			});
			return res as unknown as APIResponse<{
				data: IStudent[];
				last_key?: {
					date_added: number | string;
					type: string;
				};
				total_pages: number;
				total_items: number;
			}>;
		});
	}

	async getAsStudent() {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: '/student-student',
				method: 'GET',
				headers: {
					Authorization: await auth.getToken(),
				},
			});
			return res as unknown as APIResponse<IStudent>;
		});
	}

	async getSingle(params: Pick<IStudent, 'id'>) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: `student/${params.id}`,
				method: 'GET',
				headers: {
					Authorization: await auth.getToken(),
				},
				data: params,
			});
			return res as unknown as APIResponse<IStudent>;
		});
	}

	async post(
		params: Omit<
			IStudent,
			'id' | 'date_added' | 'type' | 'user_type' | 'position' | 'account_status'
		>
	) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: '/student',
				method: 'POST',
				headers: {
					Authorization: await auth.getToken(),
				},
				data: params,
			});
			return res as unknown as APIResponse<IStudent>;
		});
	}

	async update(params: {
		id: string;
		data: Omit<
			IStudent,
			'id' | 'date_added' | 'type' | 'user_type' | 'position' | 'account_status'
		>;
	}) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: `student/${params.id}`,
				method: 'PUT',
				headers: {
					Authorization: await auth.getToken(),
				},
				data: params.data,
			});
			return res as unknown as APIResponse<IStudent>;
		});
	}

	async delete(params: Pick<IStudent, 'id'>) {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: `student/${params.id}`,
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
				url: 'student-statistics',
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
					type: 'student';
				}[]
			>;
		});
	}
}

export const student = new Student();
