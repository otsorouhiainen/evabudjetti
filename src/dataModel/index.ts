export const DEFAULT_BUDGET_ID = 0;
export const DEFAULT_ACCOUNT_ID = 0;

export type RecurrenceBase = 'day' | 'week' | 'month' | 'year';

export type TransactionType = 'income' | 'expense';

/**
 * Represents an object that has been persisted to the database.
 */
export type Persisted<T> = T & { id: number };

/**
 * Represents a financial budget, which can contain multiple accounts and transactions.
 *
 * This is not yet supported in the current version of the app, but it implemented into the data model to allow for future expansion where users can manage multiple budgets.
 */
export interface Budget {
	name: string;
}

/**
 * Represents a financial account within a budget, which can have multiple transactions and balance reconciliations.
 *
 * This is not yet supported in the current version of the app, but it implemented into the data model to allow for future expansion where users can manage multiple accounts within a budget.
 */
export interface Account {
	budgetId: number;
	name: string;
}

/**
 * A record of an account's balance at a specific date.
 * Used to update the estimated account balance based on the real balance.
 */
export interface BalanceReconciliation {
	accountId: number;
	date: Date;
	amount: number;
}

/**
 * A category for transactions, which can be used to group and analyze transactions by type.
 */
export interface Category {
	name: string;
	type: TransactionType;
	color?: string;
	icon?: string;
}

/**
 * A budgeted transaction that can be planned to recur over time.
 * This is the main data structure for the app, as it allows users to create transactions that will automatically generate occurrences in the future based on their recurrence settings.
 */
export interface PlannedTransaction {
	accountId: number;
	name: string;
	categoryId: number;
	amount: number;
	startDate: Date;
	endDate?: Date;
	type: TransactionType;
	recurrenceBase?: RecurrenceBase;
	recurrenceInterval: number;
}

/**
 * A real transaction that has occurred,
 * either used to update an occurrence generated from a planned transaction or created independently by the user.
 */
export interface RealTransaction {
	accountId: number;
	name: string;
	categoryId: number;
	amount: number;
	date: Date;
	type: TransactionType;
	plannedTransactionId?: number;
}

/**
 * A computed transaction occurrence that is either generated from a planned transaction based on its recurrence settings
 * or created from a real transaction.
 */
export interface TransactionOccurrence {
	name: string;
	categoryId: number;
	amount: number;
	date: Date;
	type: TransactionType;
	realTransaction?: Persisted<RealTransaction>;
	plannedTransaction?: Persisted<PlannedTransaction>;
}
