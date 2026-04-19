import { useCallback } from 'react';
import type { Persisted, PlannedTransaction } from '@/src/dataModel';
import { updatePlannedTransaction } from '../query/plannedTransactionMutations';
import { useBalanceVersioning } from '../versioning/balanceVersioning';
import { useTransactionOccurrenceVersioning } from '../versioning/transactionOccurrenceVersioning';

export function useUpdatePlannedTransaction(): (
	old: Persisted<PlannedTransaction>,
	updated: Persisted<PlannedTransaction>,
) => Promise<Persisted<PlannedTransaction>> {
	const onOccurrenceUpdated = useTransactionOccurrenceVersioning(
		(state) => state.onPlannedTransactionUpdated,
	);
	const onBalanceUpdated = useBalanceVersioning(
		(state) => state.onPlannedTransactionUpdated,
	);

	return useCallback(
		async (old, updated) => {
			const result = await updatePlannedTransaction(updated);
			onOccurrenceUpdated(old, result);
			onBalanceUpdated(old, result);
			return result;
		},
		[onOccurrenceUpdated, onBalanceUpdated],
	);
}
