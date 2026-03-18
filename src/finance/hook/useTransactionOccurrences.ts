import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import type { TransactionOccurrencesMonthData } from '@/src/dataModel';
import { queueCacheUpdate } from '../cache/cacheUpdateQueueing';
import { useTransactionOccurrencesCache } from '../cache/transactionOccurrencesCache';
import { createMonthKey, monthsInRange } from '../logic/util';
import { useTransactionOccurrenceVersioning } from '../versioning/transactionOccurrenceVersioning';

/**
 * Hook to retrieve transaction occurrences for a specified month range with automatic cache management and versioning.
 *
 * @param startYear The starting year of the month range (e.g., 2023)
 * @param startMonth The starting month of the month range (0-11, where 0 = January and 11 = December)
 * @param endYear The ending year of the month range (e.g., 2023)
 * @param endMonth The ending month of the month range (0-11, where 0 = January and 11 = December)
 * @returns An array of transaction occurrence data for each month in the specified range, in chronological order.
 */
export function useTransactionOccurrences(
	startYear: number,
	startMonth: number,
	endYear: number,
	endMonth: number,
): TransactionOccurrencesMonthData[] {
	const ensureTrackingInRange = useTransactionOccurrenceVersioning(
		(state) => state.ensureTrackingInRange,
	);

	useEffect(() => {
		ensureTrackingInRange(startYear, startMonth, endYear, endMonth);
	}, [ensureTrackingInRange, startYear, startMonth, endYear, endMonth]);

	const versionsByMonth = useTransactionOccurrenceVersioning(
		useShallow((state) =>
			state.getVersionsByMonth(startYear, startMonth, endYear, endMonth),
		),
	);

	const updateTransactionOccurrencesCacheForMonths =
		useTransactionOccurrencesCache(
			(state) => state.updateTransactionOccurrencesCacheForMonths,
		);

	useEffect(() => {
		queueCacheUpdate(() =>
			updateTransactionOccurrencesCacheForMonths(
				startYear,
				startMonth,
				endYear,
				endMonth,
				versionsByMonth,
			),
		);
	}, [
		updateTransactionOccurrencesCacheForMonths,
		startYear,
		startMonth,
		endYear,
		endMonth,
		versionsByMonth,
	]);

	const data = useTransactionOccurrencesCache(
		useShallow((state) =>
			monthsInRange(startYear, startMonth, endYear, endMonth)
				.map(({ year, month }) => createMonthKey(year, month))
				.map((monthKey) => state.getMonth(monthKey)),
		),
	);

	return data;
}
