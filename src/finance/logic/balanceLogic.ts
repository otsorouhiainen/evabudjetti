import { getDaysInMonth } from 'date-fns';
import type {
	AccountBalanceMonthData,
	BalanceReconciliation,
	DayBalance,
	MonthInstance,
	TransactionOccurrence,
	TransactionOccurrencesMonthData,
} from '@/src/dataModel';
import {
	createDateKey,
	createMonthKey,
	dateToDateKey,
	getSignedOccurrenceAmount,
	monthsInRange,
} from './util';

/**
 * Calculates the daily balances for each month in the specified range,
 * based on the starting balance and the transaction occurrences.
 * @param transactionOccurrencesByMonthKey A map of monthKey to transaction occurrences for that month, sorted by date ascending
 * @param relevantBalanceReconciliations A list of balance reconciliations that fall within the date range of the months being calculated, sorted by date ascending
 * @param startBalance The balance known at startBalanceDayOfStartMonth in the first month
 * @param startBalanceDayOfStartMonth The day of the first month on which startBalance is known
 * @param startMonth The first month for which to calculate daily balances
 * @param endMonth The last month for which to calculate daily balances
 * @returns A list of AccountBalanceMonthData for each month in the specified range, in chronological order
 */
export function calculateBalanceDatasForMonths(
	transactionOccurrencesByMonthKey: Map<
		string,
		TransactionOccurrencesMonthData
	>,
	relevantBalanceReconciliations: BalanceReconciliation[],
	startBalance: number,
	startBalanceDayOfStartMonth: number,
	startMonth: MonthInstance,
	endMonth: MonthInstance,
): AccountBalanceMonthData[] {
	const monthyBalances: AccountBalanceMonthData[] = [];

	const reconciliationsByDateKey = new Map<string, BalanceReconciliation>();
	for (const reconciliation of relevantBalanceReconciliations) {
		const dateKey = dateToDateKey(reconciliation.date);
		reconciliationsByDateKey.set(dateKey, reconciliation);
	}

	let currentBalance = startBalance;

	for (const { year, month } of monthsInRange(
		startMonth.year,
		startMonth.month,
		endMonth.year,
		endMonth.month,
	)) {
		const monthKey = createMonthKey(year, month);
		const dailyBalances: (DayBalance | undefined)[] = [];

		const occurrencesData = transactionOccurrencesByMonthKey.get(monthKey);
		const monthDays = getDaysInMonth(new Date(year, month));

		const isStartMonth =
			year === startMonth.year && month === startMonth.month;
		const firstKnownDayInMonth = isStartMonth
			? startBalanceDayOfStartMonth
			: 1;
		const monthStartingBalance =
			isStartMonth && firstKnownDayInMonth !== 1
				? undefined
				: currentBalance;

		// Group occurrences by day number for easy lookup
		const occurrencesByDay = new Map<number, TransactionOccurrence[]>();
		for (const occurrence of occurrencesData?.transactionOccurrences ??
			[]) {
			const occurrenceDay = occurrence.date.getDate();
			const existing = occurrencesByDay.get(occurrenceDay);
			if (existing) {
				existing.push(occurrence);
			} else {
				occurrencesByDay.set(occurrenceDay, [occurrence]);
			}
		}

		// Fill days before the first known day as undefined (replaces the old while loop)
		for (let day = 1; day < firstKnownDayInMonth; day++) {
			dailyBalances.push(undefined);
		}

		// Single day-by-day loop replacing both the occurrence loop and the remaining days loop
		for (let day = firstKnownDayInMonth; day <= monthDays; day++) {
			// Apply reconciliation first if one exists for this day
			const reconciliationForDay = reconciliationsByDateKey.get(
				createDateKey(year, month, day),
			);
			if (reconciliationForDay) {
				currentBalance = reconciliationForDay.amount;
			}

			//Apply all transactions on top of reconciliation (or current balance)
			const occurrencesForDay = occurrencesByDay.get(day);
			if (occurrencesForDay) {
				for (const occurrence of occurrencesForDay) {
					currentBalance += getSignedOccurrenceAmount(occurrence);
				}
			}

			//Record the final end-of-day balance
			dailyBalances.push({
				balance: currentBalance,
				isReconciled: reconciliationForDay !== undefined,
			});
		}

		const monthData: AccountBalanceMonthData = {
			monthKey,
			startBalance: monthStartingBalance,
			endBalance: currentBalance,
			dailyBalances,
		};
		monthyBalances.push(monthData);
	}

	return monthyBalances;
}

/**
 * Calculates the starting balance for a given month based on transaction occurrences and a starting reconciliation.
 *
 * @param transactionOccurrencesByMonthKey A map of monthKey to transaction occurrences,
 * including months between the starting reconciliation and the month for which to calculate the starting balance,
 * sorted by date ascending within each month
 * @param startingReconciliation The balance reconciliation nearest before the start of the month for which to calculate the starting balance
 * @param targetMonth The month for which to calculate the starting balance
 */
export function calculateStartingBalanceForMonth(
	transactionOccurrencesByMonthKey: Map<
		string,
		TransactionOccurrencesMonthData
	>,
	startingReconciliation: BalanceReconciliation,
	targetMonth: MonthInstance,
): number {
	let currentBalance = startingReconciliation.amount;

	const startMonth = startingReconciliation.date.getMonth();
	const startYear = startingReconciliation.date.getFullYear();

	for (const { year, month } of monthsInRange(
		startYear,
		startMonth,
		targetMonth.year,
		targetMonth.month,
	)) {
		if (year === targetMonth.year && month === targetMonth.month) {
			// Skip the starting month since we only need to iterate up to the previous month of the starting month
			break;
		}

		const monthKey = createMonthKey(year, month);
		const occurrencesData = transactionOccurrencesByMonthKey.get(monthKey);

		if (occurrencesData === undefined) {
			continue;
		}

		// The occurrences should be sorted by date
		for (const occurrence of occurrencesData.transactionOccurrences) {
			if (
				occurrence.date.getTime() <=
				startingReconciliation.date.getTime()
			) {
				// Skip occurrences that happen before or at the starting reconciliation, since they are already included in the reconciliation amount
				continue;
			}
			currentBalance += getSignedOccurrenceAmount(occurrence);
		}
	}

	return currentBalance;
}
