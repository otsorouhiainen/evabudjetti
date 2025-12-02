import AsyncStorage from '@react-native-async-storage/async-storage';
import { add } from 'date-fns';
import * as Crypto from 'expo-crypto';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Item } from '../constants/wizardConfig';

interface PlannedTransactionsState {
	transactions: Item[];
	transactionsForTwoYears?: Item[];
	add: (item: Item) => void;
	remove: (item: Item) => void;
	replaceAll: (items: Item[]) => void;
	change: () => void;
}
const usePlannedTransactionsStore = create<PlannedTransactionsState>()(
	persist(
		(set) => ({
			transactions: [],
			transactionsForTwoYears: [],
			add: (item: Item) => {
				set((state) => {
					const newTransactions = [...state.transactions, item];
					return {
						...state,
						transactions: newTransactions,
						transactionsForTwoYears:
							generateTransactionsForTwoYears(newTransactions),
					};
				});
			},
			remove: (item: Item) => {
				set((state) => {
					// remove by matching id
					const id = item.id;
					if (id === undefined) return state;
					const newTransactions = state.transactions.filter(
						(t) => t.id !== id,
					);
					return {
						...state,
						transactions: newTransactions,
						transactionsForTwoYears:
							generateTransactionsForTwoYears(newTransactions),
					};
				});
			},
			change: () => {
				set((state) => ({
					...state,
					transactionsForTwoYears: generateTransactionsForTwoYears(
						state.transactions,
					),
				}));
			},
			replaceAll: (items: Item[]) => {
				set((state) => ({
					...state,
					transactions: items,
					transactionsForTwoYears:
						generateTransactionsForTwoYears(items),
				}));
			},
		}),
		{
			name: 'planned-transactions-storage',
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);

function generateTransactionsForTwoYears(txns: Item[]): Item[] {
	const now = new Date();
	const currentYear = now.getFullYear();
	const filteredTxns: Item[] = [];
	const createdTxnsForTwoYears: Item[] = [];

	txns.forEach((t: Item) => {
		const txnDate = new Date(t.date);
		if (txnDate.getFullYear() === currentYear) {
			filteredTxns.push({ ...t, date: txnDate });
		}
	});

	filteredTxns.forEach((t) => {
		let currentDate = new Date(t.date);
		while (
			currentDate.getFullYear() === currentYear ||
			currentDate.getFullYear() === currentYear + 1
		) {
			const newTxn: Item = {
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
					currentDate = add(currentDate, { years: 2 });
			}
		}
	});
	return createdTxnsForTwoYears;
}
export default usePlannedTransactionsStore;
