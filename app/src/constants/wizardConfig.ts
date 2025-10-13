export type Reoccurence = 'daily' | 'monthly' | 'yearly' | 'custom';

export interface Item {
	name: string;
	amount: number;
	reoccurence: Reoccurence;
	dates: Date[];
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
				amount: 100,
				reoccurence: 'monthly',
				dates: [new Date()],
			},
			{
				name: 'Item 1.2',
				amount: 150,
				reoccurence: 'monthly',
				dates: [new Date()],
			},
		],
	},
	{
		header: 'Step 2',
		items: [
			{
				name: 'Item 2',
				amount: 200,
				reoccurence: 'yearly',
				dates: [new Date()],
			},
		],
	},
	{
		header: 'Step 3',
		items: [
			{
				name: 'Item 3',
				amount: 300,
				reoccurence: 'custom',
				dates: [new Date()],
			},
		],
	},
];
