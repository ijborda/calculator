'use client';

import { APIResponse } from '@/app/interface/interface';
import { apiCaller, auth, ownedApi } from '.';

export class Statistics {
	constructor() {}

	async getStatistics() {
		return await apiCaller.call(async () => {
			const res = await ownedApi({
				url: 'statistics',
				method: 'GET',
				headers: {
					Authorization: await auth.getToken(),
				},
			});
			return res as unknown as APIResponse<
				{
					student_id: string;
					class_id: string;
					name: string;
					grade_num: number;
					grade_sum: number;
					report_total: number;
					attendance_present: number;
					attendance_total: number;
					last_updated: number;
				}[]
			>;
		});
	}
}

export const statistics = new Statistics();
