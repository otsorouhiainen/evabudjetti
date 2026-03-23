import type {
	MonthInstance,
	PlannedTransaction,
	TransactionOccurrence,
} from '@/src/dataModel';

export function dateToMonthKey(date: Date): string {
	return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
}

export function dateToDateKey(date: Date): string {
	return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

export function monthKeyToDate(monthKey: string): Date {
	const [year, monthOneBased] = monthKey.split('-').map(Number);
	return new Date(year, monthOneBased - 1, 1);
}

export function createMonthKey(year: number, month: number): string {
	return `${year}-${(month + 1).toString().padStart(2, '0')}`;
}

export function createDateKey(
	year: number,
	month: number,
	day: number,
): string {
	return `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

export function decodeMonthKey(monthKey: string): {
	year: number;
	month: number;
} {
	const [year, monthOneBased] = monthKey.split('-').map(Number);
	return { year, month: monthOneBased - 1 };
}

export function monthIsInRange(
	year: number,
	month: number,
	startYear: number,
	startMonth: number,
	endYear: number,
	endMonth: number,
): boolean {
	return (
		(year > startYear || (year === startYear && month >= startMonth)) &&
		(year < endYear || (year === endYear && month <= endMonth))
	);
}

export function monthsInRange(
	startYear: number,
	startMonth: number,
	endYear: number,
	endMonth: number,
): MonthInstance[] {
	let currentYear = startYear;
	let currentMonth = startMonth;
	const months: MonthInstance[] = [];

	while (
		currentYear < endYear ||
		(currentYear === endYear && currentMonth <= endMonth)
	) {
		months.push({ year: currentYear, month: currentMonth });

		currentMonth++;
		if (currentMonth > 11) {
			currentYear++;
			currentMonth = 0;
		}
	}

	return months;
}

export function getPreviousMonth(monthInstance: MonthInstance): MonthInstance {
	if (monthInstance.month === 0) {
		return { year: monthInstance.year - 1, month: 11 };
	}

	return { year: monthInstance.year, month: monthInstance.month - 1 };
}

export function plannedTransactionIsActiveInMonth(
	transaction: PlannedTransaction,
	monthKey: string,
): boolean {
	const month = monthKeyToDate(monthKey);

	if (transaction.recurrenceBase == null) {
		return (
			transaction.startDate.getFullYear() === month.getFullYear() &&
			transaction.startDate.getMonth() === month.getMonth()
		);
	}

	if (transaction.endDate == null) {
		return transaction.startDate <= month;
	}

	return transaction.startDate <= month && transaction.endDate >= month;
}

export function getSignedOccurrenceAmount(
	occurrence: TransactionOccurrence,
): number {
	return occurrence.type === 'income'
		? occurrence.amount
		: -occurrence.amount;
}
