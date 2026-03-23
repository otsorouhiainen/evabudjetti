import type {
	CategoryTransactionSummary,
	TransactionOccurrencesMonthData,
	TransactionSummaryMonthData,
} from '@/src/dataModel';
import { createMonthKey } from './util';

export function calculateTransactionSummaryForMonth(
	year: number,
	month: number,
	occurrencesInMonth: TransactionOccurrencesMonthData,
): TransactionSummaryMonthData {
	const monthKey = createMonthKey(year, month);

	let totalIncome = 0;
	let totalExpense = 0;
	const incomeByCategory = new Map<number, CategoryTransactionSummary>();
	const expenseByCategory = new Map<number, CategoryTransactionSummary>();

	for (const occurrence of occurrencesInMonth?.transactionOccurrences ?? []) {
		const amount = occurrence.amount;
		const categoryId = occurrence.categoryId;

		if (occurrence.type === 'income') {
			// Income
			totalIncome += amount;

			const existingIncomeCategorySummary =
				incomeByCategory.get(categoryId);
			if (existingIncomeCategorySummary) {
				existingIncomeCategorySummary.totalAmount += amount;
				existingIncomeCategorySummary.transactionOccurrences.push(
					occurrence,
				);
			} else {
				incomeByCategory.set(categoryId, {
					categoryId,
					totalAmount: amount,
					transactionOccurrences: [occurrence],
				});
			}
		} else if (occurrence.type === 'expense') {
			// Expense
			totalExpense += amount;

			const existingExpenseCategorySummary =
				expenseByCategory.get(categoryId);
			if (existingExpenseCategorySummary) {
				existingExpenseCategorySummary.totalAmount += amount;
				existingExpenseCategorySummary.transactionOccurrences.push(
					occurrence,
				);
			} else {
				expenseByCategory.set(categoryId, {
					categoryId,
					totalAmount: amount,
					transactionOccurrences: [occurrence],
				});
			}
		}
	}

	const summary: TransactionSummaryMonthData = {
		monthKey,
		totalIncome,
		totalExpense,
		cashFlow: totalIncome - totalExpense,
		incomeByCategory,
		expenseByCategory,
	};

	return summary;
}
