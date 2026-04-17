import { useCallback } from 'react';
import type { Persisted, PlannedTransaction } from '@/src/dataModel';
import { updatePlannedTransaction } from '../query/plannedTransactionMutations';
import { usePlannedTransactionVersioning } from '../versioning/plannedTransactionVersioning';

export function useUpdatePlannedTransaction(): (
	old: Persisted<PlannedTransaction>,
	updated: Persisted<PlannedTransaction>,
) => Promise<Persisted<PlannedTransaction>> {
	const onUpdated = usePlannedTransactionVersioning(
		(state) => state.onPlannedTransactionUpdated,
	);

	return useCallback(
		async (old, updated) => {
			const result = await updatePlannedTransaction(updated);
			onUpdated(old, result);
			return result;
		},
		[onUpdated],
	);
}
