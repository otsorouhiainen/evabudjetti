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

			onBalanceRealTransactionDeleted(transaction);
			onOccurrenceRealTransactionDeleted(transaction);
		},
		[onBalanceRealTransactionDeleted, onOccurrenceRealTransactionDeleted],
	);
}
