import { useCallback } from 'react';
import type { Persisted, RealTransaction } from '@/src/dataModel';
import { updateRealTransaction } from '../query/realTransactionMutations';
import { useBalanceVersioning } from '../versioning/balanceVersioning';
import { useTransactionOccurrenceVersioning } from '../versioning/transactionOccurrenceVersioning';

export function useUpdateRealTransaction() {
	const onBalanceRealTransactionUpdated = useBalanceVersioning(
		(state) => state.onRealTransactionUpdated,
	);
	const onOccurrenceRealTransactionUpdated =
		useTransactionOccurrenceVersioning(
			(state) => state.onRealTransactionUpdated,
		);

	return useCallback(
		async (
			old: Persisted<RealTransaction>,
			updated: Persisted<RealTransaction>,
		): Promise<Persisted<RealTransaction>> => {
			const result = await updateRealTransaction(updated);

			onBalanceRealTransactionUpdated(old, result);
			onOccurrenceRealTransactionUpdated(old, result);

			return result;
		},
		[onBalanceRealTransactionUpdated, onOccurrenceRealTransactionUpdated],
	);
}
