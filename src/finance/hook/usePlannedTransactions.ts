import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useCallback } from 'react';
import type { Persisted, PlannedTransaction } from '@/src/dataModel';
import { db, isDbReal } from '@/src/db/client';
import * as schema from '@/src/db/schema';
import usePlannedTransactionsStore from '@/src/store/usePlannedTransactionsStore';
import { insertPlannedTransaction } from '../query/plannedTransactionMutations';
import { usePlannedTransactionVersioning } from '../versioning/plannedTransactionVersioning';

export function usePlannedTransactions() {
	const fallbackStoreTransactions = usePlannedTransactionsStore(
		(state) => state.transactions,
	);

	const { data } = useLiveQuery(db.select().from(schema.plannedTransactions));

	return isDbReal ? (data ?? []) : fallbackStoreTransactions;
}

export function useAddPlannedTransaction(): (
	transaction: PlannedTransaction,
) => Promise<Persisted<PlannedTransaction>> {
	const onCreated = usePlannedTransactionVersioning(
		(state) => state.onPlannedTransactionCreated,
	);

	return useCallback(
		async (transaction: PlannedTransaction) => {
			const inserted = await insertPlannedTransaction(transaction);
			onCreated(inserted);
			return inserted;
		},
		[onCreated],
	);
}
