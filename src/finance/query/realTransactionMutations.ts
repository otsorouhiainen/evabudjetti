import { eq } from 'drizzle-orm';
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

export async function updateRealTransaction(
	transaction: Persisted<RealTransaction>,
): Promise<Persisted<RealTransaction>> {
	const [updated] = await db
		.update(schema.realTransactions)
		.set({
			name: transaction.name,
			amount: transaction.amount,
			date: transaction.date,
			type: transaction.type,
			categoryId: transaction.categoryId,
			plannedTransactionId: transaction.plannedTransactionId ?? null,
		})
		.where(eq(schema.realTransactions.id, transaction.id))
		.returning();

	return updated;
}

export async function deleteRealTransaction(id: number): Promise<void> {
	await db
		.delete(schema.realTransactions)
		.where(eq(schema.realTransactions.id, id));
}
