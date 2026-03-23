import { endOfMonth } from 'date-fns/endOfMonth';
import { lte } from 'drizzle-orm';
import type { BalanceReconciliation, Persisted } from '@/src/dataModel';
import { db } from '@/src/db/client';
import * as schema from '@/src/db/schema';

/**
 * Retrieves all balance reconciliations that occur before or within the given month
 * @param year The year of the month to include
 * @param month The month (0-11) to include
 * @returns A list of balance reconciliations sorted by date
 */
export async function fetchBalanceReconciliationsBeforeOrIn(
	year: number,
	month: number,
): Promise<Persisted<BalanceReconciliation>[]> {
	const data = await db
		.select()
		.from(schema.balanceReconciliations)
		.where(
			balanceReconciliationBeforeOrInDate(
				endOfMonth(new Date(year, month, 1)),
			),
		)
		.orderBy(schema.balanceReconciliations.date);

	return data;
}

const balanceReconciliationBeforeOrInDate = (end: Date) =>
	lte(schema.balanceReconciliations.date, end);
