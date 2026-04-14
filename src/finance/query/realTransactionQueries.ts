import { endOfMonth } from 'date-fns/endOfMonth';
import { and, gte, lte } from 'drizzle-orm';
import type {
	MonthInstance,
	Persisted,
	RealTransaction,
} from '@/src/dataModel';
import { db } from '@/src/db/client';
import * as schema from '@/src/db/schema';

/**
 * Retrieves all real transactions that occur within the given month range
 *
 * @param start The first month for which to retrieve real transactions
 * @param end The last month for which to retrieve real transactions
 *
 * @returns A list of all real transactions within the specified month range, sorted by date
 */
export async function fetchRealTransactionsByDateRange(
	start: MonthInstance,
	end: MonthInstance,
): Promise<Persisted<RealTransaction>[]> {
	const data = await db
		.select()
		.from(schema.realTransactions)
		.where(
			realTransactionConcernsDateRange(
				new Date(start.year, start.month, 1),
				endOfMonth(new Date(end.year, end.month, 1)),
			),
		)
		.orderBy(schema.realTransactions.date);

	return data;
}

const realTransactionConcernsDateRange = (startDate: Date, endDate: Date) =>
	and(
		gte(schema.realTransactions.date, startDate),
		lte(schema.realTransactions.date, endDate),
	);
