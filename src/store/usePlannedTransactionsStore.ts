import { eq } from 'drizzle-orm';
import { create } from 'zustand';
import type { Item } from '../constants/wizardConfig';
import { db } from '../db/client';
import { transactions } from '../db/schema';

interface PlannedTransactionsState {
	transactions: Item[];
	loading: boolean;
	fetch: () => Promise<void>;
	add: (item: Item) => Promise<void>;
	remove: (item: Item) => Promise<void>;
	replaceAll: (items: Item[]) => Promise<void>;
	change: () => void;
}

const usePlannedTransactionsStore = create<PlannedTransactionsState>(
	(set, get) => ({
		transactions: [],
		loading: false,
		fetch: async () => {
			set({ loading: true });
			try {
				const data = await db
					.select()
					.from(transactions)
					.where(eq(transactions.isPlanned, true));
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
				set({ transactions: items, loading: false });
			} catch (e) {
				console.error('Failed to fetch planned transactions:', e);
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
					isPlanned: true,
				});
				get().fetch();
			} catch (e) {
				console.error('Failed to add planned transaction:', e);
			}
		},
		remove: async (item: Item) => {
			try {
				await db
					.delete(transactions)
					.where(eq(transactions.id, item.id));
				get().fetch();
			} catch (e) {
				console.error('Failed to remove planned transaction:', e);
			}
		},
		replaceAll: async (items: Item[]) => {
			try {
				await db.transaction(async (tx) => {
					await tx
						.delete(transactions)
						.where(eq(transactions.isPlanned, true));
					if (items.length > 0) {
						await tx.insert(transactions).values(
							items.map((item) => ({
								id: item.id,
								name: item.name,
								amount: item.amount,
								date: item.date,
								categoryId: item.category,
								type: item.type,
								recurrence: item.recurrence,
								recurrenceInterval: item.recurrenceInterval,
								isPlanned: true,
							})),
						);
					}
				});
				get().fetch();
			} catch (e) {
				console.error('Failed to replace planned transactions:', e);
			}
		},
		change: () => {
			set((state) => state);
		},
	}),
);

export default usePlannedTransactionsStore;
