import { endOfMonth } from 'date-fns/endOfMonth';
import { and, gte, isNull, lt, or } from 'drizzle-orm';
import type {
	MonthInstance,
	Persisted,
	PlannedTransaction,
} from '@/src/dataModel';
import { db } from '@/src/db/client';
import * as schema from '@/src/db/schema';

/**
 * Retrieves all planned transactions that may have occurrences within the given month range
 * @param start The first month for which to retrieve planned transactions
 * @param end The last month for which to retrieve planned transactions
 * @returns A list of all planned transactions with occurrences within the specified month range, sorted by start date
 */
export async function fetchPlannedTransactionsInRange(
	start: MonthInstance,
	end: MonthInstance,
): Promise<Persisted<PlannedTransaction>[]> {
	const data = await db
		.select()
		.from(schema.plannedTransactions)
		.where(
			plannedTransactionConcernsDateRange(
				new Date(start.year, start.month, 1),
				endOfMonth(new Date(end.year, end.month, 1)),
			),
		)
		.orderBy(schema.plannedTransactions.startDate);

	return data;
}

const plannedTransactionConcernsDateRange = (startDate: Date, endDate: Date) =>
	and(
		lt(schema.plannedTransactions.startDate, endDate),
		or(
			gte(schema.plannedTransactions.endDate, startDate),
			isNull(schema.plannedTransactions.endDate),
		),
	);
