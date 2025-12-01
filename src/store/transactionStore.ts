import { desc, eq } from 'drizzle-orm';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { db } from '../db/client';
import { transactions as transactionsSchema } from '../db/schema';

// Define types based on your schema
interface Transaction {
	id: string;
	description: string;
	amount: number;
	date: Date;
}

interface TransactionStore {
	transactions: Transaction[];
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
				const parsedTransactions = transactions.map(
					(t: { date: string | number | Date }) => ({
						...t,
						date: new Date(t.date),
					}),
				);
				set({ transactions: parsedTransactions, loading: false });
			} else {
				// Native: Load from Drizzle
				const data = await (db as any)
					.select()
					.from(transactionsSchema)
					.where(
						eq(transactionsSchema.isPlanned as any, false) as any,
					)
					.orderBy(desc(transactionsSchema.date as any) as any);

				const mappedTransactions: Transaction[] = data.map(
					(t: any) => ({
						id: t.id,
						description: t.name,
						amount: t.amount,
						date: t.date,
					}),
				);

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

	addTransaction: async (description: string, amount: number) => {
		set({ loading: true, error: null });
		try {
			const newTransaction = {
				id: Math.random().toString(36).substr(2, 9), // Simple ID
				description,
				amount,
				date: new Date(),
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
				// biome-ignore lint/suspicious/noExplicitAny: Drizzle type mismatch workaround
				await (db as any).insert(transactionsSchema).values({
					id: newTransaction.id,
					name: description,
					amount: amount,
					date: newTransaction.date,
					type: 'expense', // Default to expense
					recurrence: 'none',
					isPlanned: false,
					categoryId: 'default-category-id', // Placeholder
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
