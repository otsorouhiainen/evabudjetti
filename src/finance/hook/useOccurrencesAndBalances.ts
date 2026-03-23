import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useBalanceCache } from '../cache/balanceCache';
import { queueCacheUpdate } from '../cache/cacheUpdateQueueing';
import { useOccurrencesAndBalanceCache } from '../cache/occurrencesAndBalanceCache';
import { useTransactionOccurrencesCache } from '../cache/transactionOccurrencesCache';
import { createMonthKey, monthsInRange } from '../logic/util';
import { useBalanceVersioning } from '../versioning/balanceVersioning';
import { useTransactionOccurrenceVersioning } from '../versioning/transactionOccurrenceVersioning';

/**
 * Hook to retrieve transaction occurrences and account balance data for a specified month range with automatic cache management and versioning.
 *
 * @param startYear The starting year of the month range (e.g., 2023)
 * @param startMonth The starting month of the month range (0-11, where 0 = January and 11 = December)
 * @param endYear The ending year of the month range (e.g., 2023)
 * @param endMonth The ending month of the month range (0-11, where 0 = January and 11 = December)
 * @returns An array of transaction occurrences and balance data for each month in the specified range, in chronological order.
 * Each entry contains the occurrences, starting balance, ending balance, and daily balances for that month.
 */
export function useOccurrencesAndBalances(
	startYear: number,
	startMonth: number,
	endYear: number,
	endMonth: number,
) {
	const ensureBalanceTrackingInRange = useBalanceVersioning(
		(state) => state.ensureTrackingInRange,
	);
	const ensureOccurrencesTrackingInRange = useTransactionOccurrenceVersioning(
		(state) => state.ensureTrackingInRange,
	);

	useEffect(() => {
		ensureBalanceTrackingInRange(startYear, startMonth, endYear, endMonth);
		ensureOccurrencesTrackingInRange(
			startYear,
			startMonth,
			endYear,
			endMonth,
		);
	}, [
		ensureBalanceTrackingInRange,
		ensureOccurrencesTrackingInRange,
		startYear,
		startMonth,
		endYear,
		endMonth,
	]);

	const balanceVersionsByMonth = useBalanceVersioning(
		useShallow((state) =>
			state.getVersionsByMonth(startYear, startMonth, endYear, endMonth),
		),
	);
	const updateBalanceCacheForMonths = useBalanceCache(
		(state) => state.updateBalanceCacheForMonths,
	);

	const transactionOccurrencesVersionsByMonth =
		useTransactionOccurrenceVersioning(
			useShallow((state) =>
				state.getVersionsByMonth(
					startYear,
					startMonth,
					endYear,
					endMonth,
				),
			),
		);
	const updateTransactionOccurrencesCacheForMonths =
		useTransactionOccurrencesCache(
			(state) => state.updateTransactionOccurrencesCacheForMonths,
		);

	const constructOccurrencesAndBalanceMonthDatas =
		useOccurrencesAndBalanceCache(
			(state) => state.constructOccurrencesAndBalanceMonthDatas,
		);

	useEffect(() => {
		queueCacheUpdate(async () => {
			const occurrencesState =
				await updateTransactionOccurrencesCacheForMonths(
					startYear,
					startMonth,
					endYear,
					endMonth,
					transactionOccurrencesVersionsByMonth,
				);

			const balanceState = await updateBalanceCacheForMonths(
				startYear,
				startMonth,
				endYear,
				endMonth,
				balanceVersionsByMonth,
			);

			constructOccurrencesAndBalanceMonthDatas(
				startYear,
				startMonth,
				endYear,
				endMonth,
				occurrencesState.dataByMonth,
				balanceState.dataByMonth,
			);
		});
	}, [
		updateBalanceCacheForMonths,
		updateTransactionOccurrencesCacheForMonths,
		constructOccurrencesAndBalanceMonthDatas,
		startYear,
		startMonth,
		endYear,
		endMonth,
		balanceVersionsByMonth,
		transactionOccurrencesVersionsByMonth,
	]);

	const data = useOccurrencesAndBalanceCache(
		useShallow((state) =>
			monthsInRange(startYear, startMonth, endYear, endMonth)
				.map(({ year, month }) => createMonthKey(year, month))
				.map((monthKey) => state.getMonth(monthKey)),
		),
	);

	return data;
}
