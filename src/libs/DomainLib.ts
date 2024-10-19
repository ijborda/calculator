import moment from 'moment';

export class DomainLib {
	static getAttendanceValueMeaning = (attendanceValue: number) => {
		switch (attendanceValue) {
			case -2:
				return {
					color: 'error',
					title: 'Absent',
				};
			case -1:
				return {
					color: 'warning',
					title: 'Tardy',
				};
			case 1:
				return {
					color: 'success',
					title: 'Prsent',
				};
			default:
				return {
					color: 'default',
					title: 'No Class',
				};
		}
	};

	static getAttendancePercentageMeaning = (attendancePercentage: number) => {
		if (attendancePercentage > 80) {
			return {
				color: 'success',
			};
		} else if (attendancePercentage > 60) {
			return {
				color: 'warning',
			};
		} else {
			return {
				color: 'error',
			};
		}
	};

	static getAttendancePercentage = (data: number[]) => {
		const numClassTotal = data?.filter((v: number) => v !== 0).length;
		if (!numClassTotal || numClassTotal === 0) {
			return undefined;
		}
		const numClassPresent = data.filter(
			(v: number) => v !== -2 && v !== 0
		).length;
		return (100 * numClassPresent) / numClassTotal;
	};

	static getAttendanceKeyFromDate = (date: moment.Moment) => {
		const monthString = String(date.month() + 1).padStart(2, '0');
		const yearString = String(date.year()).padStart(4, '0');
		return [monthString, yearString].join('');
	};

	static getGradePercentageMeaning(grade: number) {
		if (grade > 88) {
			return {
				color: 'success',
			};
		} else if (grade > 80) {
			return {
				color: 'warning',
			};
		} else {
			return {
				color: 'error',
			};
		}
	}
}
