import { useCallback } from 'react';
import type { Persisted, RealTransaction } from '@/src/dataModel';
import { deleteRealTransaction as deleteRealTransactionFromDb } from '../query/realTransactionMutations';
import { useBalanceVersioning } from '../versioning/balanceVersioning';
import { useTransactionOccurrenceVersioning } from '../versioning/transactionOccurrenceVersioning';

export function useDeleteRealTransaction() {
	const onBalanceRealTransactionDeleted = useBalanceVersioning(
		(state) => state.onRealTransactionDeleted,
	);
	const onOccurrenceRealTransactionDeleted =
		useTransactionOccurrenceVersioning(
			(state) => state.onRealTransactionDeleted,
		);

	return useCallback(
		async (transaction: Persisted<RealTransaction>): Promise<void> => {
			await deleteRealTransactionFromDb(transaction.id);

			// Normalize date: Drizzle expo-sqlite stores timestamps as seconds,
			// so reconstruct a proper Date if needed.
			const date =
				transaction.date instanceof Date
					? transaction.date
					: new Date(transaction.date as unknown as number);

			const deleted: RealTransaction = {
				accountId: transaction.accountId,
				name: transaction.name,
				categoryId: transaction.categoryId,
				amount: transaction.amount,
				date,
				type: transaction.type,
				plannedTransactionId: transaction.plannedTransactionId ?? null,
			};

			onBalanceRealTransactionDeleted(deleted);
			onOccurrenceRealTransactionDeleted(deleted);
		},
		[onBalanceRealTransactionDeleted, onOccurrenceRealTransactionDeleted],
	);
}
