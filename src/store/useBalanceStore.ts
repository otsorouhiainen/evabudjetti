import AsyncStorage from '@react-native-async-storage/async-storage';
import { add, addMonths, isWithinInterval } from 'date-fns';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type {
	Persisted,
	PlannedTransaction,
	TransactionOccurrence,
} from '../dataModel';

interface BalanceState {
	balance: number;
	disposable: number;
	change: (amount: number) => void;
	recalcDisposable: (
		txns: Persisted<PlannedTransaction>[],
		now?: Date,
	) => void;
}

function computeDisposable(
	balance: number,
	txns: Persisted<PlannedTransaction>[],
	now: Date,
): number {
	const currentYear = now.getFullYear();
	const filteredTxns: Persisted<PlannedTransaction>[] = [];
	const createdTxnsForTwoYears: TransactionOccurrence[] = [];

	txns.forEach((t: Persisted<PlannedTransaction>) => {
		if (t.startDate.getFullYear() === currentYear) {
			filteredTxns.push(t);
		}
	});
	filteredTxns.forEach((t) => {
		let currentDate = t.startDate;
		while (
			currentDate.getFullYear() === currentYear ||
			currentDate.getFullYear() === currentYear + 1
		) {
			const newTxn = {
				amount: t.amount,
				categoryId: t.categoryId,
				type: t.type,
				name: t.name,
				date: currentDate,
				plannedTransaction: t,
			};
			createdTxnsForTwoYears.push(newTxn);
			switch (t.recurrenceBase) {
				case 'day':
					currentDate = add(currentDate, {
						days: t.recurrenceInterval,
					});
					break;
				case 'week':
					currentDate = add(currentDate, {
						weeks: t.recurrenceInterval,
					});
					break;
				case 'month':
					currentDate = add(currentDate, {
						months: t.recurrenceInterval,
					});
					break;
				case 'year':
					currentDate = add(currentDate, {
						years: t.recurrenceInterval,
					});
					break;
				default:
					// Invalid recurrence base, break the loop
					return;
			}
		}
	});
	const horizonEnd = addMonths(now, 2);
	const upcoming = createdTxnsForTwoYears
		.filter((t) =>
			isWithinInterval(t.date, { start: now, end: horizonEnd }),
		)
		.sort((a, b) => a.date.getTime() - b.date.getTime());
	let prefix = 0;
	let minPrefix = 0;
	for (const t of upcoming) {
		const amount = t.type === 'income' ? t.amount : -t.amount;
		prefix += amount;
		if (prefix < minPrefix) minPrefix = prefix;
	}

	return balance + minPrefix;
}

const useBalanceStore = create<BalanceState>()(
	persist(
		(set, get) => ({
			balance: 0,
			disposable: 0,
			change: (amount: number) => {
				// Update balance and keep disposable consistent if caller provided transactions later
				const { disposable } = get();
				set({ balance: amount, disposable });
			},
			recalcDisposable: (
				txns: Persisted<PlannedTransaction>[],
				now: Date = new Date(),
			) => {
				const { balance } = get();
				const disposable = computeDisposable(balance, txns, now);
				set((state) => ({ ...state, disposable }));
			},
		}),
		{
			name: 'balance-storage',
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);

export default useBalanceStore;
