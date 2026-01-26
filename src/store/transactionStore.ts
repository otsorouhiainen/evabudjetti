import { desc, eq } from 'drizzle-orm';
import { Platform } from 'react-native';
import { create } from 'zustand';
import type { Item } from '../constants/wizardConfig';
import { db } from '../db/client';
import { transactions as transactionsSchema } from '../db/schema';

export interface TransactionStore {
	transactions: Item[];
	loading: boolean;
	error: string | null;

	// Actions
	fetchTransactions: () => Promise<void>;
	addTransaction: (description: string, amount: number) => Promise<void>;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
	transactions: [],
	loading: false,
	error: null,

	fetchTransactions: async () => {
		set({ loading: true, error: null });
		try {
			if (Platform.OS === 'web') {
				// Web: Load from localStorage
				const stored = localStorage.getItem('transactions');
				const transactions = stored ? JSON.parse(stored) : [];
				// Convert date strings back to Date objects
				const parsedTransactions = transactions.map((t: any) => ({
					...t,
					date: new Date(t.date),
				}));
				set({ transactions: parsedTransactions, loading: false });
			} else {
				// Native: Load from Drizzle
				const data = await db
					.select()
					.from(transactionsSchema)
					.where(eq(transactionsSchema.isPlanned, false))
					.orderBy(desc(transactionsSchema.date));

				const mappedTransactions: Item[] = data.map((t) => ({
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
					transactions: mappedTransactions,
					loading: false,
				});
			}
		} catch (error) {
			console.error('Failed to fetch transactions:', error);
			set({ error: 'Failed to fetch transactions', loading: false });
		}
	},

	addTransaction: async (transaction: Partial<Item>) => {
		set({ loading: true, error: null });
		try {
			const newTransaction: Item = {
				id: transaction.id || Math.random().toString(36).substr(2, 9),
				name: transaction.name || '',
				amount: transaction.amount || 0,
				date: transaction.date || new Date(),
				category: transaction.category || 'uncategorized',
				type: transaction.type || 'expense',
				recurrence: transaction.recurrence || 'none',
				recurrenceInterval: transaction.recurrenceInterval,
			};

			if (Platform.OS === 'web') {
				// Web: Save to localStorage
				const currentTransactions = get().transactions;
				const updatedTransactions = [
					...currentTransactions,
					newTransaction,
				];
				localStorage.setItem(
					'transactions',
					JSON.stringify(updatedTransactions),
				);
				set({ transactions: updatedTransactions, loading: false });
			} else {
				// Native: Save to Drizzle
				await db.insert(transactionsSchema).values({
					id: newTransaction.id,
					name: newTransaction.name,
					amount: newTransaction.amount,
					date: newTransaction.date,
					type: newTransaction.type,
					recurrence: newTransaction.recurrence,
					recurrenceInterval: newTransaction.recurrenceInterval,
					isPlanned: false,
					categoryId: newTransaction.category,
				});

				// Refresh list
				await get().fetchTransactions();
			}
		} catch (error) {
			console.error('Failed to add transaction:', error);
			set({ error: 'Failed to add transaction', loading: false });
		}
	},
}));
