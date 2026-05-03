import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Persisted, RealTransaction } from '../dataModel';

interface WebFallbackRealTransactionsState {
	transactions: Persisted<RealTransaction>[];
	nextId: number;
	add: (item: RealTransaction) => void;
	remove: (item: Persisted<RealTransaction>) => void;
	replaceAll: (items: Persisted<RealTransaction>[]) => void;
}

const useWebFallbackRealTransactionsStore =
	create<WebFallbackRealTransactionsState>()(
		persist(
			(set) => ({
				transactions: [],
				nextId: 1,
				add: (item: RealTransaction) => {
					set((state) => ({
						...state,
						transactions: [
							...state.transactions,
							{ ...item, id: state.nextId },
						],
						nextId: state.nextId + 1,
					}));
				},
				remove: (item: Persisted<RealTransaction>) => {
					set((state) => {
						const id = item.id;
						if (id === undefined) return state;
						return {
							...state,
							transactions: state.transactions.filter(
								(t) => t.id !== id,
							),
						};
					});
				},
				replaceAll: (items: Persisted<RealTransaction>[]) => {
					set((state) => ({
						...state,
						transactions: items,
					}));
				},
			}),
			{
				name: 'real-transactions-storage',
				storage: createJSONStorage(() => AsyncStorage),
				version: 1,
				onRehydrateStorage: () => (state) => {
					if (state) {
						// convert date from string to Date object
						state.transactions = state.transactions.map((t) => ({
							...t,
							date: new Date(t.date),
						}));
					}
				},
			},
		),
	);

export default useWebFallbackRealTransactionsStore;
