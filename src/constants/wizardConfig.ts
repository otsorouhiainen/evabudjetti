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
		header: 'Step 1',
		items: [
			{
				id: 1,
				name: 'Item 1',
				category: 'Salary',
				type: 'income',
				amount: 100,
				reoccurence: 'monthly',
				date: new Date(),
			},
			{
				id: 2,
				name: 'Item 1.2',
				category: 'Freelance',
				type: 'income',
				amount: 150,
				reoccurence: 'monthly',
				date: new Date(),
			},
		],
	},
	{
		header: 'Step 2',
		items: [
			{
				id: 3,
				name: 'Item 2',
				category: 'Rent',
				type: 'expense',
				amount: 200,
				reoccurence: 'yearly',
				date: new Date(),
			},
		],
	},
	{
		header: 'Step 3',
		items: [
			{
				id: 4,
				name: 'Item 3',
				category: 'Groceries',
				type: 'expense',
				amount: 300,
				reoccurence: 'custom',
				date: new Date(),
			},
		],
	},
];
