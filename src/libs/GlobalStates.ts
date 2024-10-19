'use client';

import { atom } from 'jotai';

export class GlobalStates {
	static user = atom<
		| undefined
		| {
				email?: string;
				phone_number?: string;
				userType?: string;
				sub?: string;
				given_name?: string;
				family_name?: string;
				position?: string;
				username?: string;
		  }
	>(undefined);
}
