import { useCallback } from 'react';
import type { Persisted, PlannedTransaction } from '@/src/dataModel';
import {
	deletePlannedTransaction,
	fetchAllPlannedTransactions,
	insertPlannedTransaction,
	replaceAllPlannedTransactions,
	updatePlannedTransaction,
} from '../query/plannedTransactionMutations';

export function useAddPlannedTransaction() {
	const addPlannedTransaction = useCallback(
		async (
			transaction: PlannedTransaction,
		): Promise<Persisted<PlannedTransaction>> => {
			return await insertPlannedTransaction(transaction);
		},
		[],
	);

	return addPlannedTransaction;
}

export function useUpdatePlannedTransaction() {
	const updatePlannedTransactionHook = useCallback(
		async (
			transaction: Persisted<PlannedTransaction>,
		): Promise<Persisted<PlannedTransaction>> => {
			return await updatePlannedTransaction(transaction);
		},
		[],
	);

	return updatePlannedTransactionHook;
}

export function useDeletePlannedTransaction() {
	const deletePlannedTransactionHook = useCallback(
		async (id: number): Promise<void> => {
			return await deletePlannedTransaction(id);
		},
		[],
	);

	return deletePlannedTransactionHook;
}

export function useReplaceAllPlannedTransactions() {
	const replaceAllPlannedTransactionsHook = useCallback(
		async (
			transactions: PlannedTransaction[],
		): Promise<Persisted<PlannedTransaction>[]> => {
			return await replaceAllPlannedTransactions(transactions);
		},
		[],
	);

	return replaceAllPlannedTransactionsHook;
}

export function useFetchAllPlannedTransactions() {
	const fetchAllPlannedTransactionsHook = useCallback(async (): Promise<
		Persisted<PlannedTransaction>[]
	> => {
		return await fetchAllPlannedTransactions();
	}, []);

	return fetchAllPlannedTransactionsHook;
}
