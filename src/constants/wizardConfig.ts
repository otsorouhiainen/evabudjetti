export type Reoccurence = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
export type TransactionType = 'income' | 'expense';
export interface Item {
	name: string;
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
				name: 'Item 1',
				type: 'income',
				amount: 100,
				reoccurence: 'monthly',
				date: new Date(),
			},
			{
				name: 'Item 1.2',
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
				name: 'Item 2',
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
				name: 'Item 3',
				type: 'expense',
				amount: 300,
				reoccurence: 'custom',
				date: new Date(),
			},
		],
	},
];
