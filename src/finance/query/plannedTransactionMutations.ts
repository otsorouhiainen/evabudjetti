import { eq } from 'drizzle-orm';
import type { Persisted, PlannedTransaction } from '@/src/dataModel';
import { db } from '@/src/db/client';
import * as schema from '@/src/db/schema';

export async function insertPlannedTransaction(
	transaction: PlannedTransaction,
): Promise<Persisted<PlannedTransaction>> {
	const [insertedPlannedTransaction] = await db
		.insert(schema.plannedTransactions)
		.values({
			...transaction,
			endDate: transaction.endDate ?? null,
			recurrenceBase: transaction.recurrenceBase ?? null,
		})
		.returning();

	return insertedPlannedTransaction;
}

export async function updatePlannedTransaction(
	transaction: Persisted<PlannedTransaction>,
): Promise<Persisted<PlannedTransaction>> {
	const [updatedPlannedTransaction] = await db
		.update(schema.plannedTransactions)
		.set({
			...transaction,
			endDate: transaction.endDate ?? null,
			recurrenceBase: transaction.recurrenceBase ?? null,
		})
		.where(eq(schema.plannedTransactions.id, transaction.id))
		.returning();

	return updatedPlannedTransaction;
}

export async function deletePlannedTransaction(id: number): Promise<void> {
	await db
		.delete(schema.plannedTransactions)
		.where(eq(schema.plannedTransactions.id, id));
}

export async function replaceAllPlannedTransactions(
	transactions: PlannedTransaction[],
): Promise<Persisted<PlannedTransaction>[]> {
	// First, delete all existing
	await db.delete(schema.plannedTransactions);

	if (transactions.length === 0) {
		return [];
	}

	// Then insert all new ones
	const insertedTransactions = await db
		.insert(schema.plannedTransactions)
		.values(
			transactions.map((t) => ({
				...t,
				endDate: t.endDate ?? null,
				recurrenceBase: t.recurrenceBase ?? null,
			})),
		)
		.returning();

	return insertedTransactions;
}

export async function fetchAllPlannedTransactions(): Promise<
	Persisted<PlannedTransaction>[]
> {
	const data = await db
		.select()
		.from(schema.plannedTransactions)
		.orderBy(schema.plannedTransactions.startDate);

	return data;
}
