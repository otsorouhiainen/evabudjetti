import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Item } from '../constants/wizardConfig';

interface RealTransactionsState {
	transactions: Item[];
	add: (item: Item) => void;
	remove: (item: Item) => void;
	replaceAll: (items: Item[]) => void;
}

const useRealTransactionsStore = create<RealTransactionsState>()(
	persist(
		(set) => ({
			transactions: [],
			add: (item: Item) => {
				set((state) => ({
					...state,
					transactions: [...state.transactions, item],
				}));
			},
			remove: (item: Item) => {
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
			replaceAll: (items: Item[]) => {
				set((state) => ({
					...state,
					transactions: items,
				}));
			},
		}),
		{
			name: 'real-transactions-storage',
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);

export default useRealTransactionsStore;
