import type { Persisted, RealTransaction } from '@/src/dataModel';
import { deleteRealTransaction } from '../query/realTransactionMutations';
import { useBalanceVersioning } from '../versioning/balanceVersioning';
import { useTransactionOccurrenceVersioning } from '../versioning/transactionOccurrenceVersioning';

export function useDeleteRealTransaction() {
	// Return a plain async function (no useCallback) so it always uses
	// getState() at call time — matching the debug view pattern exactly.
	return async (transaction: Persisted<RealTransaction>): Promise<void> => {
		await deleteRealTransaction(transaction.id);

		// Normalize date in case Drizzle returns a raw number instead of Date
		const date =
			transaction.date instanceof Date
				? transaction.date
				: new Date(transaction.date as unknown as number);

		const deletedTransaction: RealTransaction = {
			accountId: transaction.accountId,
			name: transaction.name,
			categoryId: transaction.categoryId,
			amount: transaction.amount,
			date,
			type: transaction.type,
			plannedTransactionId: transaction.plannedTransactionId ?? null,
		};

		// Use getState() directly — same pattern as the debug view.
		// This avoids any potential stale closure from React hook selectors.
		useTransactionOccurrenceVersioning
			.getState()
			.onRealTransactionDeleted(deletedTransaction);
		useBalanceVersioning
			.getState()
			.onRealTransactionDeleted(deletedTransaction);
	};
}
