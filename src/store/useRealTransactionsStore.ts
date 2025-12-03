import { eq } from 'drizzle-orm';
import { create } from 'zustand';
import type { Item } from '../constants/wizardConfig';
import { db } from '../db/client';
import { transactions } from '../db/schema';
import { generateTransactionsForTwoYears } from '../utils/transactionUtils';

interface RealTransactionsState {
	transactions: Item[];
	transactionsForTwoYears?: Item[];
	loading: boolean;
	fetch: () => Promise<void>;
	add: (item: Item) => Promise<void>;
	remove: (item: Item) => Promise<void>;
	change: () => void;
}

const useRealTransactionsStore = create<RealTransactionsState>((set, get) => ({
	transactions: [],
	transactionsForTwoYears: [],
	loading: false,
	fetch: async () => {
		set({ loading: true });
		try {
			const data = await db
				.select()
				.from(transactions)
				.where(eq(transactions.isPlanned, false));
			const items: Item[] = data.map((t) => ({
				id: t.id,
				name: t.name,
				amount: t.amount,
				date: t.date,
				category: t.categoryId || 'uncategorized',
				type: t.type as Item['type'],
				recurrence: t.recurrence as Item['recurrence'],
				recurrenceInterval: t.recurrenceInterval || undefined,
			}));
			set({
				transactions: items,
				transactionsForTwoYears: generateTransactionsForTwoYears(items),
				loading: false,
			});
		} catch (e) {
			console.error('Failed to fetch transactions:', e);
			set({ loading: false });
		}
	},
	add: async (item: Item) => {
		try {
			await db.insert(transactions).values({
				id: item.id,
				name: item.name,
				amount: item.amount,
				date: item.date,
				categoryId: item.category,
				type: item.type,
				recurrence: item.recurrence,
				recurrenceInterval: item.recurrenceInterval,
				isPlanned: false,
			});
			get().fetch();
		} catch (e) {
			console.error('Failed to add transaction:', e);
		}
	},
	remove: async (item: Item) => {
		try {
			await db.delete(transactions).where(eq(transactions.id, item.id));
			get().fetch();
		} catch (e) {
			console.error('Failed to remove transaction:', e);
		}
	},
	change: () => {
		set((state) => ({
			...state,
			transactionsForTwoYears: generateTransactionsForTwoYears(
				state.transactions,
			),
		}));
	},
}));

export default useRealTransactionsStore;
