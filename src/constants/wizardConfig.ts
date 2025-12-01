export type Recurrence =
	| 'none'
	| 'daily'
	| 'weekly'
	| 'monthly'
	| 'yearly'
	| 'custom';
export type TransactionType = 'income' | 'expense';
export interface Item {
	id: string;
	name: string;
	category: string;
	type: TransactionType;
	amount: number;
	recurrence: Recurrence;
	recurrenceInterval?: number;
	date: Date;
}

export interface BudgetWizardStep {
	header: string;
	items: Item[];
}

export const BUDGET_WIZARD_STEPS: BudgetWizardStep[] = [
	{
		header: 'Income',
		items: [],
	},
	{
		header: 'Expenses',
		items: [],
	},
];
