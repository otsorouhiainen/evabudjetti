import { and, eq, gte, lte } from 'drizzle-orm';
import { DEFAULT_ACCOUNT_ID } from '@/src/dataModel';
import { db } from '@/src/db/client';
import * as schema from '@/src/db/schema';

export async function insertBalanceReconciliation(
	amount: number,
	date: Date = new Date(),
) {
	const startOfDay = new Date(date);
	startOfDay.setHours(0, 0, 0, 0);
	const endOfDay = new Date(date);
	endOfDay.setHours(23, 59, 59, 999);
	const existingRecord = await db.query.balanceReconciliations.findFirst({
		where: and(
			gte(schema.balanceReconciliations.date, startOfDay),
			lte(schema.balanceReconciliations.date, endOfDay),
		),
	});
	if (existingRecord) {
		const [updatedReconciliation] = await db
			.update(schema.balanceReconciliations)
			.set({
				amount: amount,
				date: date,
			})
			.where(eq(schema.balanceReconciliations.id, existingRecord.id))
			.returning();

		return updatedReconciliation;
	} else {
		const [insertedReconciliation] = await db
			.insert(schema.balanceReconciliations)
			.values({
				accountId: DEFAULT_ACCOUNT_ID,
				amount: amount,
				date: date,
			})
			.returning();

		return insertedReconciliation;
	}
}
