import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { queueCacheUpdate } from '../cache/cacheUpdateQueueing';
import { useTransactionOccurrencesCache } from '../cache/transactionOccurrencesCache';
import { useTransactionSummariesCache } from '../cache/transactionSummariesCache';
import { createMonthKey, monthsInRange } from '../logic/util';
import { useTransactionOccurrenceVersioning } from '../versioning/transactionOccurrenceVersioning';

/**
 * Hook to retrieve monthly summaries of incomes and expenses by categories for a specified month range with automatic cache management and versioning.
 *
 * @param startYear The starting year of the month range (e.g., 2023)
 * @param startMonth The starting month of the month range (0-11, where 0 = January and 11 = December)
 * @param endYear The ending year of the month range (e.g., 2023)
 * @param endMonth The ending month of the month range (0-11, where 0 = January and 11 = December)
 * @returns An array of transaction summaries for each month in the specified range, in chronological order.
 * Each entry contains the summary data for that month.
 */
export function useTransactionSummaries(
	startYear: number,
	startMonth: number,
	endYear: number,
	endMonth: number,
) {
	const ensureOccurrencesTrackingInRange = useTransactionOccurrenceVersioning(
		(state) => state.ensureTrackingInRange,
	);

	useEffect(() => {
		ensureOccurrencesTrackingInRange(
			startYear,
			startMonth,
			endYear,
			endMonth,
		);
	}, [
		ensureOccurrencesTrackingInRange,
		startYear,
		startMonth,
		endYear,
		endMonth,
	]);

	const versionsByMonth = useTransactionOccurrenceVersioning(
		useShallow((state) =>
			state.getVersionsByMonth(startYear, startMonth, endYear, endMonth),
		),
	);

	const updateTransactionOccurrencesCacheForMonths =
		useTransactionOccurrencesCache(
			(state) => state.updateTransactionOccurrencesCacheForMonths,
		);

	const constructSummaryMonthDatas = useTransactionSummariesCache(
		(state) => state.constructSummaryMonthDatas,
	);

	useEffect(() => {
		queueCacheUpdate(() =>
			updateTransactionOccurrencesCacheForMonths(
				startYear,
				startMonth,
				endYear,
				endMonth,
				versionsByMonth,
			).then((transactionOccurrencesState) =>
				constructSummaryMonthDatas(
					startYear,
					startMonth,
					endYear,
					endMonth,
					transactionOccurrencesState.dataByMonth,
				),
			),
		);
	}, [
		updateTransactionOccurrencesCacheForMonths,
		constructSummaryMonthDatas,
		startYear,
		startMonth,
		endYear,
		endMonth,
		versionsByMonth,
	]);

	const data = useTransactionSummariesCache(
		useShallow((state) =>
			monthsInRange(startYear, startMonth, endYear, endMonth)
				.map(({ year, month }) => createMonthKey(year, month))
				.map((monthKey) => state.getMonth(monthKey)),
		),
	);

	return data;
}
