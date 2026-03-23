import { create } from 'zustand/react';
import type {
	AccountBalanceMonthData,
	OccurrencesAndBalanceMonthData,
	TransactionOccurrencesMonthData,
} from '@/src/dataModel';
import { createMonthKey, monthsInRange } from '../logic/util';

export interface OccurrencesAndBalanceCacheState {
	dataByMonth: Map<string, OccurrencesAndBalanceMonthData>;

	constructOccurrencesAndBalanceMonthDatas: (
		startYear: number,
		startMonth: number,
		endYear: number,
		endMonth: number,
		occurrencesMonthData: Map<string, TransactionOccurrencesMonthData>,
		balanceMonthData: Map<string, AccountBalanceMonthData>,
	) => void;
	getMonth: (monthKey: string) => OccurrencesAndBalanceMonthData;
}

export const useOccurrencesAndBalanceCache =
	create<OccurrencesAndBalanceCacheState>((set, get) => ({
		dataByMonth: new Map(),

		constructOccurrencesAndBalanceMonthDatas: (
			startYear: number,
			startMonth: number,
			endYear: number,
			endMonth: number,
			occurrencesMonthData: Map<string, TransactionOccurrencesMonthData>,
			balanceMonthData: Map<string, AccountBalanceMonthData>,
		) => {
			const state = get();
			const newDataByMonth = new Map(state.dataByMonth);
			let hasChanges = false;
			const changedMonths = [];

			for (const { year, month } of monthsInRange(
				startYear,
				startMonth,
				endYear,
				endMonth,
			)) {
				const monthKey = createMonthKey(year, month);
				const occurrencesData = occurrencesMonthData.get(monthKey);
				const balanceData = balanceMonthData.get(monthKey);

				if (
					occurrencesData === undefined ||
					balanceData === undefined
				) {
					continue;
				}

				const existingMonthData = state.dataByMonth.get(monthKey);
				if (
					existingMonthData !== undefined &&
					existingMonthData.startBalance ===
						balanceData.startBalance &&
					existingMonthData.endBalance === balanceData.endBalance &&
					existingMonthData.dailyBalances ===
						balanceData.dailyBalances &&
					existingMonthData.transactionOccurrences ===
						occurrencesData.transactionOccurrences
				) {
					continue;
				}

				changedMonths.push(monthKey);

				const monthData: OccurrencesAndBalanceMonthData = {
					...occurrencesData,
					...balanceData,
				};

				newDataByMonth.set(monthKey, monthData);
				hasChanges = true;
			}

			console.debug(
				`[OccurrencesAndBalanceCache] constructOccurrencesAndBalanceMonthDatas: ${startYear}-${startMonth} to ${endYear}-${endMonth}, changed=${hasChanges}, changedMonths=[${changedMonths.join(', ')}]`,
			);

			if (!hasChanges) {
				return;
			}

			set({ dataByMonth: newDataByMonth });
		},

		getMonth: (monthKey: string) => {
			const monthData = get().dataByMonth.get(monthKey);

			if (monthData === undefined) {
				return getCachedEmptyMonthData(monthKey);
			}

			return monthData;
		},
	}));

const emptyMonthCaches = new Map();

function getCachedEmptyMonthData(
	monthKey: string,
): OccurrencesAndBalanceMonthData {
	const cachedEmptyMonthData = emptyMonthCaches.get(monthKey);

	if (cachedEmptyMonthData !== undefined) {
		return cachedEmptyMonthData;
	}

	const emptyMonthData = {
		monthKey,
		startBalance: undefined,
		endBalance: undefined,
		dailyBalances: [],
		transactionOccurrences: [],
	};

	emptyMonthCaches.set(monthKey, emptyMonthData);
	return emptyMonthData;
}
