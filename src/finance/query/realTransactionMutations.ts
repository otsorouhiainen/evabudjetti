import type { Persisted, RealTransaction } from '@/src/dataModel';
import { db, isWebFallbackMode } from '@/src/db/client';
import * as schema from '@/src/db/schema';
import useRealTransactionsStore from '@/src/store/useRealTransactionsStore';

export async function insertRealTransaction(
	transaction: RealTransaction,
): Promise<Persisted<RealTransaction>> {
	if (isWebFallbackMode) {
		const nextId = useRealTransactionsStore.getState().nextId;
		return {
			...transaction,
			id: nextId,
			plannedTransactionId: transaction.plannedTransactionId ?? null,
		};
	}

	const [insertedRealTransaction] = await db
		.insert(schema.realTransactions)
		.values({
			...transaction,
			plannedTransactionId: transaction.plannedTransactionId ?? null,
		})
		.returning();

	return insertedRealTransaction;
}
