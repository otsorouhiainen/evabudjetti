export type Txn = {
	id: string;
	description: string;
	name: string;
	date: Date;
	amount: number | string;
	rrule: string;
	createdAt: Date;
	updatedAt: Date;
	category: string;
};
