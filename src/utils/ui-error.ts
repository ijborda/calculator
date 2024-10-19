'use client';

export class UIError extends Error {
	// Don't log UI error by default
	allowLog: boolean = false;

	constructor(msg: string, opt?: { allowLog: boolean }) {
		super(msg);
		this.allowLog = opt?.allowLog || false;
	}
}
