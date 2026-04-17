import { useCallback } from 'react';
import type { Persisted, PlannedTransaction } from '@/src/dataModel';
import { deletePlannedTransaction } from '../query/plannedTransactionMutations';
import { usePlannedTransactionVersioning } from '../versioning/plannedTransactionVersioning';

export function useDeletePlannedTransaction(): (
	transaction: Persisted<PlannedTransaction>,
) => Promise<void> {
	const onDeleted = usePlannedTransactionVersioning(
		(state) => state.onPlannedTransactionDeleted,
	);

	return useCallback(
		async (transaction) => {
			await deletePlannedTransaction(transaction.id);
			onDeleted(transaction);
		},
		[onDeleted],
	);
}
