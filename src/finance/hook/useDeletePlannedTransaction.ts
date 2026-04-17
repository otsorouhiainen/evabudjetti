import { useCallback } from 'react';
import type { Persisted, PlannedTransaction } from '@/src/dataModel';
import { deletePlannedTransaction } from '../query/plannedTransactionMutations';
import { useBalanceVersioning } from '../versioning/balanceVersioning';
import { usePlannedTransactionVersioning } from '../versioning/plannedTransactionVersioning';
import { useTransactionOccurrenceVersioning } from '../versioning/transactionOccurrenceVersioning';

export function useDeletePlannedTransaction(): (
	transaction: Persisted<PlannedTransaction>,
) => Promise<void> {
	const onDeleted = usePlannedTransactionVersioning(
		(state) => state.onPlannedTransactionDeleted,
	);
	const onOccurrenceDeleted = useTransactionOccurrenceVersioning(
		(state) => state.onPlannedTransactionDeleted,
	);
	const onBalanceDeleted = useBalanceVersioning(
		(state) => state.onPlannedTransactionDeleted,
	);

	return useCallback(
		async (transaction) => {
			await deletePlannedTransaction(transaction.id);
			onDeleted(transaction);
			onOccurrenceDeleted(transaction);
			onBalanceDeleted(transaction);
		},
		[onDeleted, onOccurrenceDeleted, onBalanceDeleted],
	);
}
