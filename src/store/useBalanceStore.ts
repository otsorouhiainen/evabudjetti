import AsyncStorage from '@react-native-async-storage/async-storage';
import { add, addMonths, isWithinInterval } from 'date-fns';
import * as Crypto from 'expo-crypto';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Item } from '../constants/wizardConfig';

interface BalanceState {
	balance: number;
	disposable: number;
	change: (amount: number) => void;
	recalcDisposable: (txns: Item[], now?: Date) => void;
}

function computeDisposable(balance: number, txns: Item[], now: Date): number {
	const currentYear = now.getFullYear();
	const filteredTxns: Item[] = [];
	const createdTxnsForTwoYears: Item[] = [];

	txns.forEach((t: Item) => {
		t.date = new Date(t.date);
		if (t.date.getFullYear() === currentYear) {
			filteredTxns.push(t);
		}
	});
	filteredTxns.forEach((t) => {
		let currentDate = t.date;
		while (
			currentDate.getFullYear() === currentYear ||
			currentDate.getFullYear() === currentYear + 1
		) {
			const newTxn = {
				...t,
				date: new Date(currentDate),
				id: Crypto.randomUUID(),
			};
			createdTxnsForTwoYears.push(newTxn);
			switch (t.recurrence) {
				case 'daily':
					currentDate = add(currentDate, { days: 1 });
					break;
				case 'weekly':
					currentDate = add(currentDate, { weeks: 1 });
					break;
				case 'monthly':
					currentDate = add(currentDate, { months: 1 });
					break;
				case 'yearly':
					currentDate = add(currentDate, { years: 1 });
					break;
				case 'custom':
					if (t.recurrenceInterval) {
						currentDate = add(currentDate, {
							days: t.recurrenceInterval,
						});
					}
					break;
				default:
					currentDate = add(currentDate, { years: 1 });
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
			recalcDisposable: (txns: Item[], now: Date = new Date()) => {
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
