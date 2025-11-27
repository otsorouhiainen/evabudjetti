import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Item } from '../constants/wizardConfig';

interface RealTransactionsState {
	transactions: Item[];
	add: (item: Item) => void;
	remove: (item: Item) => void;
	change: () => void;
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
					// remove by matching id
					const id = item.id;
					if (id === undefined) return state;
					const newTransactions = state.transactions.filter(
						(t) => t.id !== id,
					);
					return { ...state, transactions: newTransactions };
				});
			},
			change: () => {
				set((state) => state);
			},
		}),
		{
			name: 'real-storage',
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
export default useRealTransactionsStore;
