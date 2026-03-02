export interface MonthSummary {
	id: string;
	name: string;
	year: string;
	change: number;
	status: 'warning' | 'ok';
}

export const allMonthsData: MonthSummary[] = [
	{ id: '26-1', name: 'Tammikuu', year: '2026', change: 24.0, status: 'ok' },
	{ id: '26-2', name: 'Helmikuu', year: '2026', change: 30.0, status: 'ok' },
	{ id: '26-3', name: 'Maaliskuu', year: '2026', change: 15.0, status: 'ok' },
	{ id: '26-4', name: 'Huhtikuu', year: '2026', change: 10.0, status: 'ok' },
	{ id: '26-5', name: 'Toukokuu', year: '2026', change: 5.0, status: 'ok' },
	{ id: '26-6', name: 'Kesäkuu', year: '2026', change: 0.0, status: 'ok' },
	{
		id: '26-7',
		name: 'Heinäkuu',
		year: '2026',
		change: -5.0,
		status: 'warning',
	},
	{
		id: '26-8',
		name: 'Elokuu',
		year: '2026',
		change: -10.0,
		status: 'warning',
	},
	{
		id: '26-9',
		name: 'Syyskuu',
		year: '2026',
		change: -20.0,
		status: 'warning',
	},
	{
		id: '26-10',
		name: 'Lokakuu',
		year: '2026',
		change: -30.0,
		status: 'warning',
	},
	{
		id: '26-11',
		name: 'Marraskuu',
		year: '2026',
		change: -40.0,
		status: 'warning',
	},
	{
		id: '26-12',
		name: 'Joulukuu',
		year: '2026',
		change: -50.0,
		status: 'warning',
	},
	{
		id: '27-1',
		name: 'Tammikuu',
		year: '2027',
		change: -50.0,
		status: 'warning',
	},
	{ id: '27-2', name: 'Helmikuu', year: '2027', change: 24.0, status: 'ok' },
	{ id: '27-3', name: 'Maaliskuu', year: '2027', change: 65.0, status: 'ok' },
	{
		id: '27-4',
		name: 'Huhtikuu',
		year: '2027',
		change: -12.0,
		status: 'warning',
	},
	{ id: '27-5', name: 'Toukokuu', year: '2027', change: 20.0, status: 'ok' },
	{ id: '27-6', name: 'Kesäkuu', year: '2027', change: 10.0, status: 'ok' },
	{
		id: '27-7',
		name: 'Heinäkuu',
		year: '2027',
		change: -15.0,
		status: 'warning',
	},
	{
		id: '27-8',
		name: 'Elokuu',
		year: '2027',
		change: -25.0,
		status: 'warning',
	},
	{
		id: '27-9',
		name: 'Syyskuu',
		year: '2027',
		change: -35.0,
		status: 'warning',
	},
	{
		id: '27-10',
		name: 'Lokakuu',
		year: '2027',
		change: -45.0,
		status: 'warning',
	},
	{
		id: '27-11',
		name: 'Marraskuu',
		year: '2027',
		change: -55.0,
		status: 'warning',
	},
	{
		id: '27-12',
		name: 'Joulukuu',
		year: '2027',
		change: -65.0,
		status: 'warning',
	},
];
