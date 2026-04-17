import { useCallback } from 'react';
import type { Persisted, PlannedTransaction } from '@/src/dataModel';
import { updatePlannedTransaction } from '../query/plannedTransactionMutations';
import { useBalanceVersioning } from '../versioning/balanceVersioning';
import { usePlannedTransactionVersioning } from '../versioning/plannedTransactionVersioning';
import { useTransactionOccurrenceVersioning } from '../versioning/transactionOccurrenceVersioning';

export function useUpdatePlannedTransaction(): (
	old: Persisted<PlannedTransaction>,
	updated: Persisted<PlannedTransaction>,
) => Promise<Persisted<PlannedTransaction>> {
	const onUpdated = usePlannedTransactionVersioning(
		(state) => state.onPlannedTransactionUpdated,
	);
	const onOccurrenceUpdated = useTransactionOccurrenceVersioning(
		(state) => state.onPlannedTransactionUpdated,
	);
	const onBalanceUpdated = useBalanceVersioning(
		(state) => state.onPlannedTransactionUpdated,
	);

	return useCallback(
		async (old, updated) => {
			const result = await updatePlannedTransaction(updated);
			onUpdated(old, result);
			onOccurrenceUpdated(old, result);
			onBalanceUpdated(old, result);
			return result;
		},
		[onUpdated, onOccurrenceUpdated, onBalanceUpdated],
	);
}
