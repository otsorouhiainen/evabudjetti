import { useMemo } from 'react';
import { calculateUsableFundsPerDayForDateRange } from '../logic/usableFundsLogic';
import { useBalances } from './useBalances';

/**
 * Hook to retrieve a per-day usable funds amount for a specific date range.
 *
 * @param startYear The starting year of the range (e.g., 2026)
 * @param startMonth The starting month of the range (0-11)
 * @param startDay The starting day of the range (1-31)
 * @param endYear The ending year of the range (e.g., 2026)
 * @param endMonth The ending month of the range (0-11)
 * @param endDay The ending day of the range (1-31)
 * @returns A number representing the maximum constant amount that can be used per day in the given range without the balance becoming negative.
 */
export function useUsableFunds(
	startYear: number,
	startMonth: number,
	startDay: number,
	endYear: number,
	endMonth: number,
	endDay: number,
): number {
	const balanceMonthDatas = useBalances(
		startYear,
		startMonth,
		endYear,
		endMonth,
	);

	const usableFundsPerDay = useMemo(
		() =>
			calculateUsableFundsPerDayForDateRange(
				startYear,
				startMonth,
				startDay,
				endYear,
				endMonth,
				endDay,
				balanceMonthDatas,
			),
		[
			startYear,
			startMonth,
			startDay,
			endYear,
			endMonth,
			endDay,
			balanceMonthDatas,
		],
	);

	return usableFundsPerDay;
}
