import { create } from 'zustand';
import { Item } from '../constants/wizardConfig';
interface PlannedTransactionsState {
    transactions: Item[]
    add: (item: Item) => void;
    remove: (item: Item) => void;
    change: () => void;
}
const usePlannedTransactionsStore = create<PlannedTransactionsState>()((set) => ({
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
            const newTransactions = state.transactions.filter((t) => t.id !== id);
            return { ...state, transactions: newTransactions };
        });
        },
        change: () => {
		set((state) => state);
	},
}));
export default usePlannedTransactionsStore