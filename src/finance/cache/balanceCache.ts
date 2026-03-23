import { create } from 'zustand';
import type {
	AccountBalanceMonthData,
	BalanceReconciliation,
	MonthInstance,
} from '@/src/dataModel';
import {
	calculateBalanceDatasForMonths,
	calculateStartingBalanceForMonth,
} from '../logic/balanceLogic';
import { createMonthKey, getPreviousMonth, monthsInRange } from '../logic/util';
import { fetchBalanceReconciliationsBeforeOrIn } from '../query/balanceReconciliationQueries';
import { useTransactionOccurrenceVersioning } from '../versioning/transactionOccurrenceVersioning';
import { useTransactionOccurrencesCache } from './transactionOccurrencesCache';

export interface AccountBalanceMonthCacheData extends AccountBalanceMonthData {
	/** Version of the month at the time of the cache update */
	version: number;
}

export interface BalanceCacheState {
	dataByMonth: Map<string, AccountBalanceMonthCacheData>;

	updateBalanceCacheForMonths: (
		startYear: number,
		startMonth: number,
		endYear: number,
		endMonth: number,
		monthVersions: Map<string, number>,
	) => Promise<BalanceCacheState>;
	getMonth: (monthKey: string) => AccountBalanceMonthCacheData;
}

export interface BalanceCacheStateUpdate {
	dataByMonth: Map<string, AccountBalanceMonthCacheData>;
}

export const useBalanceCache = create<BalanceCacheState>((set, get) => ({
	dataByMonth: new Map(),

	updateBalanceCacheForMonths: async (
		startYear: number,
		startMonth: number,
		endYear: number,
		endMonth: number,
		monthVersions: Map<string, number>,
	) => {
		const oldCacheState = get();
		const monthUpdates = await updateBalanceCacheForMonths(
			startYear,
			startMonth,
			endYear,
			endMonth,
			monthVersions,
			oldCacheState,
		);

		if (monthUpdates.length === 0) {
			// No months were updated, do not change the state
			return oldCacheState;
		}

		set((state) =>
			updateMonthsBalances(monthUpdates, monthVersions, state),
		);

		return get();
	},

	getMonth: (monthKey: string) => {
		const monthData = get().dataByMonth.get(monthKey);

		if (monthData === undefined) {
			return getCachedEmptyMonthData(monthKey);
		}

		return monthData;
	},
}));

export async function updateBalanceCacheForMonths(
	startYear: number,
	startMonth: number,
	endYear: number,
	endMonth: number,
	monthVersions: Map<string, number>,
	oldCacheState: BalanceCacheState,
): Promise<AccountBalanceMonthCacheData[]> {
	let firstMonthToUpdate: MonthInstance | undefined;

	const start = performance.now();

	for (const { year, month } of monthsInRange(
		startYear,
		startMonth,
		endYear,
		endMonth,
	)) {
		const monthKey = createMonthKey(year, month);
		const monthData = oldCacheState.dataByMonth.get(monthKey);
		const requiredVersion = monthVersions.get(monthKey) ?? 0;

		if (monthData === undefined || monthData.version < requiredVersion) {
			if (firstMonthToUpdate === undefined) {
				firstMonthToUpdate = { year, month };
				// The balance update need will always also affect subsequent months,
				// so we can stop looking for more months to update after finding the first one that needs updating
				break;
			}
		}
	}

	if (firstMonthToUpdate === undefined) {
		// No months need updating, return an empty update to avoid unnecessary state updates
		return [];
	}

	console.debug(
		`[BalanceCache] Updating balance cache for months ${createMonthKey(
			firstMonthToUpdate.year,
			firstMonthToUpdate.month,
		)} to ${createMonthKey(endYear, endMonth)}`,
	);

	const monthBeforeFirstToUpdate = getPreviousMonth(firstMonthToUpdate);
	const monthBeforeFirstToUpdateKey = createMonthKey(
		monthBeforeFirstToUpdate.year,
		monthBeforeFirstToUpdate.month,
	);
	const monthBeforeFirstToUpdateData = oldCacheState.dataByMonth.get(
		monthBeforeFirstToUpdateKey,
	);
	const monthBeforeFirstToUpdateVersion =
		monthVersions.get(monthBeforeFirstToUpdateKey) ?? 0;

	const startingBalanceIsFresh =
		monthBeforeFirstToUpdateData !== undefined &&
		monthBeforeFirstToUpdateData.version >=
			monthBeforeFirstToUpdateVersion &&
		monthBeforeFirstToUpdateData.endBalance !== undefined;

	const balanceReconciliations = await fetchBalanceReconciliationsBeforeOrIn(
		endYear,
		endMonth,
	);

	// Find the reconciliation just before the needed update range
	let relevantReconciliationsStart = balanceReconciliations.findLastIndex(
		(r) =>
			r.date <=
			new Date(firstMonthToUpdate.year, firstMonthToUpdate.month, 1),
	);

	// If there are no such reconciliations, take the first reconciliation in the range
	if (relevantReconciliationsStart === -1) {
		relevantReconciliationsStart = balanceReconciliations.findIndex(
			(r) =>
				r.date >=
				new Date(firstMonthToUpdate.year, firstMonthToUpdate.month, 1),
		);
	}

	// If there are no reconciliations in or before the range, we cannot calculate any meaningful balances
	if (relevantReconciliationsStart === -1) {
		// Cache empty data for the months in the range to avoid trying to update them again before we have a reconciliation
		return getEmptyDataFillingMonthUpdates(
			firstMonthToUpdate.year,
			firstMonthToUpdate.month,
			endYear,
			endMonth,
			monthVersions,
		);
	}

	const relevantReconciliations = balanceReconciliations.slice(
		relevantReconciliationsStart,
	);

	let anchorReconciliation: BalanceReconciliation | undefined;
	let adjustedStartYear = firstMonthToUpdate.year;
	let adjustedStartMonth = firstMonthToUpdate.month;

	// It the starting balance is not fresh, find the extended range of transaction occurrences we need
	if (!startingBalanceIsFresh) {
		anchorReconciliation = relevantReconciliations[0];
		const anchorReconciliationStartDate = relevantReconciliations[0].date;
		adjustedStartYear = anchorReconciliationStartDate.getFullYear();
		adjustedStartMonth = anchorReconciliationStartDate.getMonth();
	}

	// Make sure we have the necessary occurrences data for the months we need to update
	const transactionOccurrencesVersioningState =
		useTransactionOccurrenceVersioning.getState();
	transactionOccurrencesVersioningState.ensureTrackingInRange(
		adjustedStartYear,
		adjustedStartMonth,
		endYear,
		endMonth,
	);
	const neededOccurrencesVersions =
		transactionOccurrencesVersioningState.getVersionsByMonth(
			adjustedStartYear,
			adjustedStartMonth,
			endYear,
			endMonth,
		);

	console.debug(
		`[BalanceCache] About to call updateTransactionOccurrencesCacheForMonths with versions:`,
		{
			months: Array.from(neededOccurrencesVersions.entries()),
		},
	);

	const transactionOccurrencesData = await useTransactionOccurrencesCache
		.getState()
		.updateTransactionOccurrencesCacheForMonths(
			adjustedStartYear,
			adjustedStartMonth,
			endYear,
			endMonth,
			neededOccurrencesVersions,
		);

	let startingBalance: number;
	let startingBalanceMonth = firstMonthToUpdate;
	let startingBalanceDayOfMonth: number;

	if (
		startingBalanceIsFresh &&
		monthBeforeFirstToUpdateData.endBalance !== undefined
	) {
		startingBalance = monthBeforeFirstToUpdateData.endBalance;
		startingBalanceDayOfMonth = 1;
	} else {
		if (anchorReconciliation === undefined) {
			throw new Error(
				'This should not happen: anchor reconciliation is undefined',
			);
		}

		// We need to calculate the starting balance based on reconciliations,
		// or if the only reconciliation is in the range, the start balance
		// must be consider to be mid range

		if (
			anchorReconciliation.date.getFullYear() > firstMonthToUpdate.year ||
			(anchorReconciliation.date.getFullYear() ===
				firstMonthToUpdate.year &&
				anchorReconciliation.date.getMonth() >=
					firstMonthToUpdate.month)
		) {
			// The only reconciliation is in the calculation range, consider the starting balance to be mid range
			startingBalance = anchorReconciliation.amount;
			startingBalanceMonth = {
				year: anchorReconciliation.date.getFullYear(),
				month: anchorReconciliation.date.getMonth(),
			};
			startingBalanceDayOfMonth = anchorReconciliation.date.getDate();
		} else {
			// The starting balance is based on a reconciliation before the starting month,
			// so we can calculate and use the real starting balance at the start of the month
			startingBalance = calculateStartingBalanceForMonth(
				transactionOccurrencesData.dataByMonth,
				anchorReconciliation,
				firstMonthToUpdate,
			);
			startingBalanceDayOfMonth = 1;
		}
	}

	const monthUpdates = [];

	// Cache empty data for any months in the range before the reconciliation,
	// to avoid trying to update them again before we can calculate meaningful balances for them
	for (const { year, month } of monthsInRange(
		firstMonthToUpdate.year,
		firstMonthToUpdate.month,
		startingBalanceMonth.year,
		startingBalanceMonth.month,
	)) {
		// Skip the starting month since the calculation below handles it
		if (
			year === startingBalanceMonth.year &&
			month === startingBalanceMonth.month
		) {
			break;
		}

		const monthKey = createMonthKey(year, month);

		monthUpdates.push(
			getCachedEmptyMonthData(monthKey, monthVersions.get(monthKey) ?? 0),
		);
	}

	monthUpdates.push(
		...calculateBalanceDatasForMonths(
			transactionOccurrencesData.dataByMonth,
			relevantReconciliations,
			startingBalance,
			startingBalanceDayOfMonth,
			startingBalanceMonth,
			{ year: endYear, month: endMonth },
		),
	);

	console.debug(
		`[BalanceCache] Calculated balance cache updates for months ${createMonthKey(
			firstMonthToUpdate.year,
			firstMonthToUpdate.month,
		)} to ${createMonthKey(endYear, endMonth)} in ${performance.now() - start} ms`,
	);

	return monthUpdates.map((monthData) => ({
		...monthData,
		version: monthVersions.get(monthData.monthKey) ?? 0,
	}));
}

export function updateMonthsBalances(
	updates: AccountBalanceMonthData[],
	monthVersions: Map<string, number>,
	state: BalanceCacheState,
): Partial<BalanceCacheStateUpdate> {
	const updatedDataByMonth = new Map(state.dataByMonth);

	for (const update of updates) {
		const { monthKey, startBalance, endBalance, dailyBalances } = update;
		const monthData = state.dataByMonth.get(monthKey);
		const requiredVersion = monthVersions.get(monthKey) ?? 0;

		if (monthData !== undefined && monthData.version >= requiredVersion) {
			// Don't update if the existing data is already fresh
			continue;
		}

		const updatedMonthData = {
			monthKey,
			startBalance,
			endBalance,
			dailyBalances,
			version: requiredVersion,
		};

		if (updatedMonthData !== undefined) {
			updatedDataByMonth.set(monthKey, updatedMonthData);
		}
	}

	return { dataByMonth: updatedDataByMonth };
}

const emptyMonthCaches = new Map();

function getCachedEmptyMonthData(
	monthKey: string,
	version: number = -1,
): AccountBalanceMonthCacheData {
	const cachedEmptyMonthData = emptyMonthCaches.get(monthKey);

	if (
		cachedEmptyMonthData !== undefined &&
		cachedEmptyMonthData.version >= version
	) {
		return cachedEmptyMonthData;
	}

	const emptyMonthData = {
		monthKey,
		startBalance: undefined,
		endBalance: undefined,
		dailyBalances: [],
		version,
	};

	emptyMonthCaches.set(monthKey, emptyMonthData);
	return emptyMonthData;
}

function getEmptyDataFillingMonthUpdates(
	startYear: number,
	startMonth: number,
	endYear: number,
	endMonth: number,
	versionsByMonth: Map<string, number>,
): AccountBalanceMonthCacheData[] {
	const updatedMonthDatas = [];

	for (const { year, month } of monthsInRange(
		startYear,
		startMonth,
		endYear,
		endMonth,
	)) {
		const monthKey = createMonthKey(year, month);

		const emptyMonthData = getCachedEmptyMonthData(
			monthKey,
			versionsByMonth.get(monthKey) ?? -1,
		);
		updatedMonthDatas.push(emptyMonthData);
	}

	return updatedMonthDatas;
}
