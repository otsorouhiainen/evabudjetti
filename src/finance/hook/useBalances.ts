import { useEffect, useMemo, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import {
	type AccountBalanceMonthCacheData,
	useBalanceCache,
} from '../cache/balanceCache';
import { queueCacheUpdate } from '../cache/cacheUpdateQueueing';
import { createMonthKey, monthsInRange } from '../logic/util';
import { useBalanceVersioning } from '../versioning/balanceVersioning';

/**
 * Hook to retrieve account balance data for a specified month range with automatic cache management and versioning.
 *
 * @param startYear The starting year of the month range (e.g., 2023)
 * @param startMonth The starting month of the month range (0-11, where 0 = January and 11 = December)
 * @param endYear The ending year of the month range (e.g., 2023)
 * @param endMonth The ending month of the month range (0-11, where 0 = January and 11 = December)
 * @returns An array of balance data for each month in the specified range, in chronological order. Each entry contains the starting balance, ending balance, and daily balances for that month.
 */
export function useBalances(
	startYear: number,
	startMonth: number,
	endYear: number,
	endMonth: number,
): AccountBalanceMonthCacheData[] {
	const ensureTrackingInRange = useBalanceVersioning(
		(state) => state.ensureTrackingInRange,
	);

	useEffect(() => {
		ensureTrackingInRange(startYear, startMonth, endYear, endMonth);
	}, [ensureTrackingInRange, startYear, startMonth, endYear, endMonth]);

	const versionsByMonth = useBalanceVersioning(
		useShallow((state) =>
			state.getVersionsByMonth(startYear, startMonth, endYear, endMonth),
		),
	);
	const versionsByMonthRef = useRef(versionsByMonth);

	useEffect(() => {
		versionsByMonthRef.current = versionsByMonth;
	}, [versionsByMonth]);

	const versionsByMonthSignature = useMemo(
		() => Array.from(versionsByMonth.entries()).join('|'),
		[versionsByMonth],
	);

	const updateBalanceCacheForMonths = useBalanceCache(
		(state) => state.updateBalanceCacheForMonths,
	);

	useEffect(() => {
		void versionsByMonthSignature;

		queueCacheUpdate(() =>
			updateBalanceCacheForMonths(
				startYear,
				startMonth,
				endYear,
				endMonth,
				versionsByMonthRef.current,
			),
		);
	}, [
		updateBalanceCacheForMonths,
		startYear,
		startMonth,
		endYear,
		endMonth,
		versionsByMonthSignature,
	]);

	const data = useBalanceCache(
		useShallow((state) =>
			monthsInRange(startYear, startMonth, endYear, endMonth)
				.map(({ year, month }) => createMonthKey(year, month))
				.map((monthKey) => state.getMonth(monthKey)),
		),
	);

	return data;
}
