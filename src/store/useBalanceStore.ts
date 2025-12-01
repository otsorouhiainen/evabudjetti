import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface BalanceState {
	balance: number;
	disposable: number;
	change: (amount: number) => void;
}
const useBalanceStore = create<BalanceState>()(
	persist(
		(set) => ({
			balance: 0,
			disposable: 0,
			change: (amount: number) => {
				set((state) => ({ ...state, balance: amount }));
			},
		}),
		{
			name: 'balance-storage',
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);

export default useBalanceStore;
