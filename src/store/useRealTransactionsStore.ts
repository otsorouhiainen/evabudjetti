import { create } from "zustand";
import { Item } from "../constants/wizardConfig";

interface RealTransactionsState {
    transactions: Item[];
    add: (item: Item) => void;
    remove: (item: Item) => void;
    change: () => void;
}
const useRealTransactionsStore = create<RealTransactionsState>()((set) => ({
    transactions: [],
    add: (item: Item) => {
        set((state) => ({
            ...state,
            transactions: [...state.transactions, item],
        }));
    },
    remove: (item: Item) => {
        set((state) => {
            // remove by matching name
            const name = item.name;
            if (name === undefined) return state;
            const idx = state.transactions.findIndex((t) => t.name === name);
            if (idx === -1) return state;
            const newTransactions = state.transactions.slice(0, idx).concat(state.transactions.slice(idx + 1));
            return { ...state, transactions: newTransactions };
        });
    },
    change: () => {
        set((state) => state);
    },
}));
export default useRealTransactionsStore;
