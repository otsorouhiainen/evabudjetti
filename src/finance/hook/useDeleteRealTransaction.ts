import { useCallback } from 'react';
import type { Persisted, RealTransaction } from '@/src/dataModel';
import { deleteRealTransaction } from '../query/realTransactionMutations';
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
			await deleteRealTransaction(transaction.id);

			// Normalize date in case Drizzle returns a number instead of Date
			const date =
				transaction.date instanceof Date
					? transaction.date
					: new Date(transaction.date as unknown as number);

			onBalanceRealTransactionDeleted({ ...transaction, date });
			onOccurrenceRealTransactionDeleted({ ...transaction, date });
		},
		[onBalanceRealTransactionDeleted, onOccurrenceRealTransactionDeleted],
	);
}
