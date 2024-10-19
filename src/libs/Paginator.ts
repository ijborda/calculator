'use client';

import React from 'react';
import { Announcement } from './Announcement';
import { Teacher } from './Teacher';
import { Subject } from './Subject';
import { Student } from './Student';
import { Admin } from './Admin';
import { Course } from './Course';
import { Enroll } from './Enroll';
import { Attendance } from './Attendance';
import { Grade } from './Grade';
import { Report } from './Report';

export class Paginator {
	constructor(
		private params: {
			/**
			 * Service that does the actual data fetching
			 */
			service:
				| Announcement
				| Teacher
				| Subject
				| Student
				| Admin
				| Course
				| Enroll
				| Attendance
				| Grade
				| Report;
			/**
			 * Controls the data to be displayed to the UI
			 */
			setData: React.Dispatch<React.SetStateAction<any>>;
			/**
			 * Manages the max number of pages
			 */
			maxPage: number;
			setMaxPage: React.Dispatch<React.SetStateAction<number>>;
			/**
			 * Saves the start key to be used on fetching data
			 * The index corresponds to the page number
			 * Example: when fetching page 3 startKeys[3] is used (in general: startKeys[pageNum])
			 * Null means no start key needed
			 */
			startKeys: (null | number | string)[];
			setStartKeys: React.Dispatch<
				React.SetStateAction<(null | number | string)[]>
			>;
			/**
			 * Saves the start key to be used on fetching data, but this is only used when backward searching is required
			 * The startKeys is preferred, but whenever it is inefficient to use (e.g. when jumping to last page), the invStartKey is used instead
			 * The index corresponds to the order of the page starting from the last
			 * Example: when fetching the last page invStartKey[1] is used (in general: invStartKey[maxPage - pageNum])
			 * Null means no start key needed
			 * Optional. If none is provided, then we don't support jump to last page.
			 */
			invStartKeys?: (null | number | string)[];
			setInvStartKeys?: React.Dispatch<
				React.SetStateAction<(null | number | string)[]>
			>;
			/**
			 * Manages the max number of items
			 */
			setMaxItem?: React.Dispatch<React.SetStateAction<number>>;
			/**
			 * Optionally, the id to be included in path params
			 * Example: For enroll class type, we need to pass class id as path params
			 */
			id?: string;
			/**
			 * Optionally, enable if this is user level query
			 * Example: For enroll class type, we need to pass class id as path params
			 */
			userLevelQuery?: boolean;
			/**
			 * Optionally, the start key name to obtain, instead of the default date added
			 * Example: On grade, the evaluated keys are class id and student id and none of the date_added
			 */
			startKeyName?: string;
		}
	) {}

	/**
	 * Initial state of startKeys
	 */
	public static getInitStartKeys = () => {
		// First two elements are null because start key is not needed when querying the first page, and page 0 does not exist
		return React.useState<(number | string | null)[]>([null, null]);
	};

	/**
	 * Initial state of InvStartKeys
	 */
	public static getInitInvStartKeys = () => {
		// First element is null because start key is not needed when querying last page using backward search
		return React.useState<(number | string | null)[]>([null]);
	};

	/**
	 * Controls the data based on page number
	 */
	public onChangeHandler = async (
		_: any | React.ChangeEvent<unknown>,
		page: number
	) => {
		// Special page: Page 3
		if (page === 3 && this.isNoKeysSaved(page)) {
			this.handleJumpToPageThree();
			return;
		}
		// Special page: Third to the last page (last page - 2)
		if (page === this.params.maxPage - 2 && this.isNoKeysSaved(page)) {
			this.handleJumpThirdToLastPage();
			return;
		}
		// Use forward search
		if (this.isKeySavedOnForward(page)) {
			const res = await this.fetch({
				startKey: this.params.startKeys[page],
			});
			// Append only if next is empty
			if (!this.params.startKeys[page + 1]) {
				if (this.params.startKeyName && res.data.last_key) {
					this.appendStartKey({
						newStartKeys: [
							(res.data.last_key as any)[this.params.startKeyName],
						],
					});
				} else {
					this.appendStartKey({
						newStartKeys: [res.data.last_key?.date_added],
					});
				}
			}
			return;
		}
		// Use backward search
		if (this.params.invStartKeys) {
			if (this.isKeySavedOnBackward(page)) {
				const res = await this.fetch({
					startKey: this.params.invStartKeys[this.params.maxPage - page],
					sort: 'asc',
				});
				// Append only if next is empty
				if (!this.params.invStartKeys[this.params.maxPage - page + 1]) {
					if (this.params.startKeyName && res.data.last_key) {
						this.appendStartKey({
							newStartKeys: [
								(res.data.last_key as any)[this.params.startKeyName],
							],
							isInverseKey: true,
						});
					} else {
						this.appendStartKey({
							newStartKeys: [res.data.last_key?.date_added],
							isInverseKey: true,
						});
					}
				}

				return;
			}
		}
	};

	/**
	 * Fetches first and last pages on first load
	 */
	public initialFetch = async () => {
		if (!this.params.invStartKeys) {
			// If jump to last page is not supported, fetch first page upfront only
			const firstPageRes = await this.fetch();

			if (this.params.startKeyName && firstPageRes.data.last_key) {
				this.appendStartKey({
					newStartKeys: [
						(firstPageRes.data.last_key as any)[this.params.startKeyName],
					],
				});
			} else {
				this.appendStartKey({
					newStartKeys: [firstPageRes.data.last_key?.date_added],
				});
			}
		} else {
			// If jump to last page is supported, fetch first and last pages upfront
			const [firstPageRes, lastPageRes] = await Promise.all([
				this.fetch(),
				this.fetch({ backGroundOp: true, sort: 'asc' }), // Don't show to UI, just background fetch
			]);
			// Update start keys
			if (this.params.startKeyName && firstPageRes.data.last_key) {
				this.appendStartKey({
					newStartKeys: [
						(firstPageRes.data.last_key as any)[this.params.startKeyName],
					],
				});
				this.appendStartKey({
					newStartKeys: [
						(lastPageRes.data.last_key as any)[this.params.startKeyName],
					],
					isInverseKey: true,
				});
			} else {
				this.appendStartKey({
					newStartKeys: [firstPageRes.data.last_key?.date_added],
				});
				this.appendStartKey({
					newStartKeys: [lastPageRes.data.last_key?.date_added],
					isInverseKey: true,
				});
			}
		}
	};

	/**
	 * Performs the fetching and applies necessary search parameters
	 * Also updates the maxPage and the data shown to the UI
	 */
	private fetch = async (params?: {
		sort?: 'asc' | 'desc';
		startKey?: number | string | null;
		backGroundOp?: boolean;
	}) => {
		let res;
		// If startKey is null, then to startKey is needed to do the query
		if (params?.startKey === null) {
			if (
				this.params.userLevelQuery &&
				(this.params.service instanceof Report ||
					this.params.service instanceof Attendance ||
					this.params.service instanceof Grade)
			) {
				res = await this.params.service.getAsStudent({
					sort: params?.sort,
					...(this.params.id && { id: this.params.id }),
				});
			} else {
				res = await this.params.service.get({
					sort: params?.sort,
					...(this.params.id && { id: this.params.id }),
				});
			}
		} else {
			if (
				this.params.userLevelQuery &&
				(this.params.service instanceof Report ||
					this.params.service instanceof Attendance ||
					this.params.service instanceof Grade)
			) {
				res = await this.params.service.getAsStudent({
					startKey: params?.startKey,
					sort: params?.sort,
					...(this.params.id && { id: this.params.id }),
				});
			} else {
				res = await this.params.service.get({
					startKey: params?.startKey,
					sort: params?.sort,
					...(this.params.id && { id: this.params.id }),
				});
			}
		}
		this.params.setMaxPage(res.data.total_pages);
		if (this.params.setMaxItem) {
			this.params.setMaxItem(res.data.total_items);
		}
		// Only show the data if the operation is not background operation
		// Background operation is done when there is a need to do intermediate queries before the actual query
		// Example: When jumping to Page 3, we do background query for Page 2
		if (!params?.backGroundOp) {
			this.params.setData(
				res.data.data.sort((d1, d2) => d2.date_added - d1.date_added)
			);
		}
		return res;
	};

	/**
	 * Append new start key to the existing start keys
	 */
	private appendStartKey = (params: {
		newStartKeys: (number | string | undefined)[];
		isInverseKey?: boolean;
	}) => {
		if (!params.newStartKeys.every((k) => k)) return;
		if (
			params.isInverseKey === true &&
			this.params.invStartKeys &&
			this.params.setInvStartKeys
		) {
			this.params.setInvStartKeys([
				...this.params.invStartKeys,
				...(params.newStartKeys as number[]),
			]);
		} else {
			this.params.setStartKeys([
				...this.params.startKeys,
				...(params.newStartKeys as number[]),
			]);
		}
	};

	/**
	 * Checks if there is a saved start key either using forward search or backward search
	 */
	private isNoKeysSaved = (page: number) => {
		return !this.isKeySavedOnForward(page) && !this.isKeySavedOnBackward(page);
	};

	/**
	 * Checks if there is a saved start key using forward search
	 */
	private isKeySavedOnForward = (page: number) => {
		return this.params.startKeys[page] || this.params.startKeys[page] === null;
	};

	/**
	 * Checks if there is a saved start key using backward search
	 */
	private isKeySavedOnBackward = (page: number) => {
		return (
			this.params.invStartKeys &&
			(this.params.invStartKeys[this.params.maxPage - page] ||
				this.params.invStartKeys[this.params.maxPage - page] === null)
		);
	};

	/**
	 * Handles scenario where the user jumps to page three
	 */
	private handleJumpToPageThree = async () => {
		// Fetch Page 2 on the background
		const page2Res = await this.fetch({
			startKey: this.params.startKeys[2],
			backGroundOp: true,
		});
		// Now query actual Page 3 using the start key from Page 2
		const page3Res = await this.fetch({
			startKey: page2Res.data.last_key?.date_added,
		});
		// Update start keys

		if (
			this.params.startKeyName &&
			page2Res.data.last_key &&
			page3Res.data.last_key
		) {
			this.appendStartKey({
				newStartKeys: [
					(page2Res.data.last_key as any)[this.params.startKeyName],
					(page3Res.data.last_key as any)[this.params.startKeyName],
				],
			});
		} else {
			this.appendStartKey({
				newStartKeys: [
					page2Res.data.last_key?.date_added,
					page3Res.data.last_key?.date_added,
				],
			});
		}
	};

	/**
	 * Handles scenario where the user jumps to last page
	 */
	private handleJumpThirdToLastPage = async () => {
		if (!this.params.invStartKeys) {
			return;
		}
		// Fetch Page 2 from the last on the background
		const page2FromLatRes = await this.fetch({
			startKey: this.params.invStartKeys[1],
			sort: 'asc',
			backGroundOp: true,
		});
		// Now query actual Page 3 from the last using the start key from Page 2 from the last
		const page3FromLatRes = await this.fetch({
			startKey: page2FromLatRes.data.last_key?.date_added,
			sort: 'asc',
		});
		// Update start keys
		if (
			this.params.startKeyName &&
			page2FromLatRes.data.last_key &&
			page3FromLatRes.data.last_key
		) {
			this.appendStartKey({
				newStartKeys: [
					(page2FromLatRes.data.last_key as any)[this.params.startKeyName],
					(page3FromLatRes.data.last_key as any)[this.params.startKeyName],
				],
				isInverseKey: true,
			});
		} else {
			this.appendStartKey({
				newStartKeys: [
					page2FromLatRes.data.last_key?.date_added,
					page3FromLatRes.data.last_key?.date_added,
				],
				isInverseKey: true,
			});
		}
	};
}
