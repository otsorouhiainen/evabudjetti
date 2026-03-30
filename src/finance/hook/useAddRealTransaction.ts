import { useCallback } from 'react';
import type { Persisted, RealTransaction } from '@/src/dataModel';
import { insertRealTransaction } from '../query/realTransactionMutations';
import { useBalanceVersioning } from '../versioning/balanceVersioning';
import { useTransactionOccurrenceVersioning } from '../versioning/transactionOccurrenceVersioning';

export function useAddRealTransaction() {
	const onBalanceRealTransactionCreated = useBalanceVersioning(
		(state) => state.onRealTransactionCreated,
	);
	const onOccurrenceRealTransactionCreated =
		useTransactionOccurrenceVersioning(
			(state) => state.onRealTransactionCreated,
		);

	const addRealTransaction = useCallback(
		async (
			transaction: RealTransaction,
		): Promise<Persisted<RealTransaction>> => {
			const insertedTransaction =
				await insertRealTransaction(transaction);

			onBalanceRealTransactionCreated(insertedTransaction);
			onOccurrenceRealTransactionCreated(insertedTransaction);

			return insertedTransaction;
		},
		[onBalanceRealTransactionCreated, onOccurrenceRealTransactionCreated],
	);

	return addRealTransaction;
}
