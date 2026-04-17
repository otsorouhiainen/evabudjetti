import { useCallback } from 'react';
import type { Persisted, PlannedTransaction } from '@/src/dataModel';
import { insertPlannedTransaction } from '../query/plannedTransactionMutations';
import { useBalanceVersioning } from '../versioning/balanceVersioning';
import { usePlannedTransactionVersioning } from '../versioning/plannedTransactionVersioning';
import { useTransactionOccurrenceVersioning } from '../versioning/transactionOccurrenceVersioning';

export function useAddPlannedTransaction(): (
  transaction: PlannedTransaction,
) => Promise<Persisted<PlannedTransaction>> {
  const onCreated = usePlannedTransactionVersioning(
    (state) => state.onPlannedTransactionCreated,
  );
  const onOccurrenceCreated = useTransactionOccurrenceVersioning(
    (state) => state.onPlannedTransactionCreated,
  );
  const onBalanceCreated = useBalanceVersioning(
    (state) => state.onPlannedTransactionCreated,
  );

  return useCallback(
    async (transaction: PlannedTransaction) => {
      const inserted = await insertPlannedTransaction(transaction);
      onCreated(inserted);
      onOccurrenceCreated(inserted);
      onBalanceCreated(inserted);
      return inserted;
    },
    [onCreated, onOccurrenceCreated, onBalanceCreated],
  );
}
