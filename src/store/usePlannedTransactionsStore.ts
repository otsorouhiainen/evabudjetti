import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type {
	Persisted,
	PlannedTransaction,
	TransactionOccurrence,
} from '../dataModel';
import { generateTransactionsForTwoYears } from '../utils/transactionUtils';

export interface PlannedTransactionsState {
	transactions: Persisted<PlannedTransaction>[];
	transactionsForTwoYears: TransactionOccurrence[];
	nextId: number;
	add: (item: PlannedTransaction) => void;
	remove: (item: Persisted<PlannedTransaction>) => void;
	replaceAll: (
		items: (PlannedTransaction | Persisted<PlannedTransaction>)[],
	) => void;
	change: () => void;
}

export const usePlannedTransactionsStore = create<PlannedTransactionsState>()(
	persist(
		(set) => ({
			transactions: [],
			transactionsForTwoYears: [],
			nextId: 1,
			add: (item: PlannedTransaction) => {
				set((state) => {
					const newTransactions = [
						...state.transactions,
						{ ...item, id: state.nextId },
					];

					return {
						...state,
						transactions: newTransactions,
						transactionsForTwoYears:
							generateTransactionsForTwoYears(newTransactions),
						nextId: state.nextId + 1,
					};
				});
			},
			remove: (item: Persisted<PlannedTransaction>) => {
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
			replaceAll: (
				items: (PlannedTransaction | Persisted<PlannedTransaction>)[],
			) => {
				const transactions = items.map((item, index) => {
					return { ...item, id: index + 1 };
				});

				set((state) => ({
					...state,
					transactions: transactions,
					transactionsForTwoYears:
						generateTransactionsForTwoYears(transactions),
				}));
			},
		}),
		{
			name: 'planned-transactions-storage',
			storage: createJSONStorage(() => AsyncStorage),
			version: 1,
			onRehydrateStorage: () => (state) => {
				if (state) {
					// convert date from string to Date object
					state.transactions = state.transactions.map((t) => ({
						...t,
						startDate: new Date(t.startDate),
						endDate: t.endDate ? new Date(t.endDate) : undefined,
					}));
				}
			},
		},
	),
);

export default usePlannedTransactionsStore;
