import type { Persisted, RealTransaction } from '@/src/dataModel';
import { db } from '@/src/db/client';
import * as schema from '@/src/db/schema';

export async function insertRealTransaction(
	transaction: RealTransaction,
): Promise<Persisted<RealTransaction>> {
	const [insertedRealTransaction] = await db
		.insert(schema.realTransactions)
		.values({
			...transaction,
			plannedTransactionId: transaction.plannedTransactionId ?? null,
		})
		.returning();

	return insertedRealTransaction;
}
