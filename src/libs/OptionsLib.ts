export class OptionsLib {
	static bloodTypes = [
		{ value: 'a+', label: 'A+' },
		{ value: 'a-', label: 'A-' },
		{ value: 'b+', label: 'B+' },
		{ value: 'b-', label: 'B-' },
		{ value: 'ab+', label: 'AB+' },
		{ value: 'ab-', label: 'AB-' },
		{ value: 'o+', label: 'O+' },
		{ value: 'o-', label: 'O-' },
	];

	static gender = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' },
	];

	static religion = [
		{ value: 'catholic', label: 'Catholic' },
		{ value: 'islam', label: 'Islam' },
	];

	static boolean = [
		{ value: 'true', label: 'Yes' },
		{ value: 'false', label: 'No' },
	];

	static academicStanding = [
		{
			value: 'good',
			label: 'Good Standing',
		},
		{
			value: 'academic probation',
			label: 'Academic Probation',
		},
		{
			value: 'subject to disqualification',
			label: 'Subject to Disqualification',
		},
		{
			value: 'academic standing review',
			label: 'Academic Standing Review',
		},
	];

	static gradeLevels = [
		{
			value: '7',
			label: '7',
		},
		{
			value: '8',
			label: '8',
		},
		{
			value: '9',
			label: '9',
		},
		{
			value: '10',
			label: '10',
		},
		{
			value: '11',
			label: '11',
		},
		{
			value: '12',
			label: '12',
		},
	];

	static studentStatus = [
		{ value: 'active', label: 'Active' },
		{ value: 'inactive', label: 'Inactive' },
	];

	static attendanceStatus = [
		{ value: '-2', label: 'Absent' },
		{ value: '-1', label: 'Tardy' },
		{ value: '0', label: 'No Class' },
		{ value: '1', label: 'Present' },
	];
}
