import { endOfMonth } from 'date-fns/endOfMonth';
import { and, gte, isNull, lt, or } from 'drizzle-orm';
import type {
	MonthInstance,
	Persisted,
	PlannedTransaction,
} from '@/src/dataModel';
import { db, isWebFallbackMode } from '@/src/db/client';
import * as schema from '@/src/db/schema';
import usePlannedTransactionsStore from '@/src/store/usePlannedTransactionsStore';

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
	if (isWebFallbackMode) {
		const rangeStart = new Date(start.year, start.month, 1);
		const rangeEnd = endOfMonth(new Date(end.year, end.month, 1));

		return usePlannedTransactionsStore
			.getState()
			.transactions.filter((transaction) =>
				plannedTransactionConcernsDateRangeLocal(
					transaction,
					rangeStart,
					rangeEnd,
				),
			)
			.sort(
				(a, b) =>
					new Date(a.startDate).getTime() -
					new Date(b.startDate).getTime(),
			);
	}

	const data = await db
		.select()
		.from(schema.plannedTransactions)
		.where(
			plannedTransactionConcernsDateRangeSql(
				new Date(start.year, start.month, 1),
				endOfMonth(new Date(end.year, end.month, 1)),
			),
		)
		.orderBy(schema.plannedTransactions.startDate);

	return data;
}

const plannedTransactionConcernsDateRangeSql = (
	startDate: Date,
	endDate: Date,
) =>
	and(
		lt(schema.plannedTransactions.startDate, endDate),
		or(
			gte(schema.plannedTransactions.endDate, startDate),
			isNull(schema.plannedTransactions.endDate),
		),
	);

const plannedTransactionConcernsDateRangeLocal = (
	transaction: Persisted<PlannedTransaction>,
	startDate: Date,
	endDate: Date,
) => {
	const transactionStartDate = new Date(transaction.startDate);
	const transactionEndDate = transaction.endDate
		? new Date(transaction.endDate)
		: null;

	return (
		transactionStartDate < endDate &&
		(transactionEndDate === null || transactionEndDate >= startDate)
	);
};
