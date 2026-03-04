import { add } from 'date-fns';
import type {
	Persisted,
	PlannedTransaction,
	TransactionOccurrence,
} from '../dataModel';

export function generateTransactionsForTwoYears(
	txns: Persisted<PlannedTransaction>[],
): TransactionOccurrence[] {
	const now = new Date();
	const currentYear = now.getFullYear();
	const filteredTxns: Persisted<PlannedTransaction>[] = [];
	const createdTxnsForTwoYears: TransactionOccurrence[] = [];

	txns.forEach((t: Persisted<PlannedTransaction>) => {
		const txnDate = t.startDate;
		if (txnDate.getFullYear() === currentYear) {
			filteredTxns.push(t);
		}
	});

	filteredTxns.forEach((t) => {
		let currentDate = new Date(t.startDate);
		while (
			currentDate.getFullYear() === currentYear ||
			currentDate.getFullYear() === currentYear + 1
		) {
			const newTxn: TransactionOccurrence = {
				amount: t.amount,
				categoryId: t.categoryId,
				type: t.type,
				name: t.name,
				date: new Date(currentDate),
				plannedTransaction: t,
			};
			createdTxnsForTwoYears.push(newTxn);
			switch (t.recurrenceBase) {
				case 'day':
					currentDate = add(currentDate, {
						days: t.recurrenceInterval ?? 1,
					});
					break;
				case 'week':
					currentDate = add(currentDate, {
						weeks: t.recurrenceInterval ?? 1,
					});
					break;
				case 'month':
					currentDate = add(currentDate, {
						months: t.recurrenceInterval ?? 1,
					});
					break;
				case 'year':
					currentDate = add(currentDate, {
						years: t.recurrenceInterval ?? 1,
					});
					break;
				default:
					return;
			}
		}
	});
	return createdTxnsForTwoYears;
}
