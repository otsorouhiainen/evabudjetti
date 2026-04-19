import { useCallback } from 'react';
import type { Persisted, PlannedTransaction } from '@/src/dataModel';
import { deletePlannedTransaction } from '../query/plannedTransactionMutations';
import { useBalanceVersioning } from '../versioning/balanceVersioning';
import { useTransactionOccurrenceVersioning } from '../versioning/transactionOccurrenceVersioning';

export function useDeletePlannedTransaction(): (
	transaction: Persisted<PlannedTransaction>,
) => Promise<void> {
	const onOccurrenceDeleted = useTransactionOccurrenceVersioning(
		(state) => state.onPlannedTransactionDeleted,
	);
	const onBalanceDeleted = useBalanceVersioning(
		(state) => state.onPlannedTransactionDeleted,
	);

	return useCallback(
		async (transaction) => {
			await deletePlannedTransaction(transaction.id);
			onOccurrenceDeleted(transaction);
			onBalanceDeleted(transaction);
		},
		[onOccurrenceDeleted, onBalanceDeleted],
	);
}
