export type Reoccurence =
	| 'none'
	| 'daily'
	| 'weekly'
	| 'monthly'
	| 'yearly'
	| 'custom';
export type TransactionType = 'income' | 'expense';
export interface Item {
	id: number;
	name: string;
	category: string;
	type: TransactionType;
	amount: number;
	reoccurence: Reoccurence;
	reoccurenceInterval?: number;
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
