import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Persisted, RealTransaction } from '../dataModel';

interface RealTransactionsState {
	transactions: Persisted<RealTransaction>[];
	add: (item: Persisted<RealTransaction>) => void;
	remove: (item: Persisted<RealTransaction>) => void;
	replaceAll: (items: Persisted<RealTransaction>[]) => void;
}

const useRealTransactionsStore = create<RealTransactionsState>()(
	persist(
		(set) => ({
			transactions: [],
			add: (item: Persisted<RealTransaction>) => {
				set((state) => ({
					...state,
					transactions: [...state.transactions, item],
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

export default useRealTransactionsStore;
