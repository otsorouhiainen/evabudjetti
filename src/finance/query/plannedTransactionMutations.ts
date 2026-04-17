import { eq } from 'drizzle-orm';
import type { Persisted, PlannedTransaction } from '@/src/dataModel';
import { db } from '@/src/db/client';
import * as schema from '@/src/db/schema';

export async function insertPlannedTransaction(
	transaction: PlannedTransaction,
): Promise<Persisted<PlannedTransaction>> {
	const [inserted] = await db
		.insert(schema.plannedTransactions)
		.values({
			accountId: transaction.accountId,
			name: transaction.name,
			categoryId: transaction.categoryId,
			amount: transaction.amount,
			startDate: transaction.startDate,
			endDate: transaction.endDate ?? null,
			type: transaction.type,
			recurrenceBase: transaction.recurrenceBase ?? null,
			recurrenceInterval: transaction.recurrenceInterval,
		})
		.returning();

	return {
		...transaction,
		id: inserted.id,
	};
}

export async function updatePlannedTransaction(
	transaction: Persisted<PlannedTransaction>,
): Promise<Persisted<PlannedTransaction>> {
	const [updated] = await db
		.update(schema.plannedTransactions)
		.set({
			name: transaction.name,
			categoryId: transaction.categoryId,
			amount: transaction.amount,
			startDate: transaction.startDate,
			endDate: transaction.endDate ?? null,
			type: transaction.type,
			recurrenceBase: transaction.recurrenceBase ?? null,
			recurrenceInterval: transaction.recurrenceInterval,
		})
		.where(eq(schema.plannedTransactions.id, transaction.id))
		.returning();

	return { ...transaction, id: updated.id };
}

export async function deletePlannedTransaction(id: number): Promise<void> {
	await db
		.delete(schema.plannedTransactions)
		.where(eq(schema.plannedTransactions.id, id));
}
