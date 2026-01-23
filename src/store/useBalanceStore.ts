import { create } from 'zustand';

interface BalanceState {
	balance: number;
	disposable: number;
	change: (amount: number) => void;
}
const useBalanceStore = create<BalanceState>()((set) => ({
	balance: 0,
	disposable: 0,
	change: (amount: number) => {
		set((state) => ({ ...state, balance: amount }));
	},
}));
export default useBalanceStore;
