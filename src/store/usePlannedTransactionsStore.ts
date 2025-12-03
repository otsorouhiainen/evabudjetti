import AsyncStorage from '@react-native-async-storage/async-storage';
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

import { generateTransactionsForTwoYears } from '../utils/transactionUtils';
export default usePlannedTransactionsStore;
