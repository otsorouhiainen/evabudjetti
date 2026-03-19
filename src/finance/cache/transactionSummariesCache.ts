import { create } from 'zustand/react';
import type { TransactionSummaryMonthData } from '@/src/dataModel';
import { calculateTransactionSummaryForMonth } from '../logic/transactionSummaryLogic';
import { createMonthKey, monthsInRange } from '../logic/util';
import type { TransactionOccurrencesMonthCacheData } from './transactionOccurrencesCache';

export interface TransactionSummariesCacheState {
	dataByMonth: Map<string, TransactionSummaryMonthCacheData>;

	constructSummaryMonthDatas: (
		startYear: number,
		startMonth: number,
		endYear: number,
		endMonth: number,
		occurrencesMonthData: Map<string, TransactionOccurrencesMonthCacheData>,
	) => void;
	getMonth: (monthKey: string) => TransactionSummaryMonthData;
}

interface TransactionSummaryMonthCacheData extends TransactionSummaryMonthData {
	version: number;
}

export const useTransactionSummariesCache =
	create<TransactionSummariesCacheState>((set, get) => ({
		dataByMonth: new Map(),

		constructSummaryMonthDatas: (
			startYear: number,
			startMonth: number,
			endYear: number,
			endMonth: number,
			occurrencesMonthData: Map<
				string,
				TransactionOccurrencesMonthCacheData
			>,
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

				let newMonthData: TransactionSummaryMonthCacheData | undefined;
				const existingMonthData = state.dataByMonth.get(monthKey);

				if (occurrencesData !== undefined) {
					// Skip update if already up-to-date cache data exists for the month
					if (
						existingMonthData !== undefined &&
						occurrencesData.version <= existingMonthData.version
					) {
						continue;
					}

					newMonthData = {
						...calculateTransactionSummaryForMonth(
							year,
							month,
							occurrencesData,
						),
						version: occurrencesData.version,
					};
				}

				if (
					newMonthData !== undefined &&
					existingMonthData !== undefined
				) {
					const monthDataUnchanged =
						existingMonthData.version >= newMonthData.version;

					if (monthDataUnchanged) {
						continue;
					}
				}

				if (newMonthData !== undefined) {
					changedMonths.push(monthKey);
					newDataByMonth.set(monthKey, newMonthData);
					hasChanges = true;
				}
			}

			console.debug(
				`[TransactionSummariesCache] constructSummaryMonthDatas: ${startYear}-${startMonth} to ${endYear}-${endMonth}, changed=${hasChanges}, changedMonths=[${changedMonths.join(', ')}]`,
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
	version: number = -1,
): TransactionSummaryMonthCacheData {
	const cachedEmptyMonthData = emptyMonthCaches.get(monthKey);

	if (cachedEmptyMonthData !== undefined) {
		return cachedEmptyMonthData;
	}

	const emptyMonthData = {
		monthKey,
		totalIncome: 0,
		totalExpense: 0,
		cashFlow: 0,
		incomeByCategory: new Map(),
		expenseByCategory: new Map(),
		version,
	};

	emptyMonthCaches.set(monthKey, emptyMonthData);
	return emptyMonthData;
}
