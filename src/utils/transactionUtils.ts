import { add } from 'date-fns';
import * as Crypto from 'expo-crypto';
import type { Item } from '../constants/wizardConfig';

export function generateTransactionsForTwoYears(txns: Item[]): Item[] {
	const now = new Date();
	const currentYear = now.getFullYear();
	const filteredTxns: Item[] = [];
	const createdTxnsForTwoYears: Item[] = [];

	txns.forEach((t: Item) => {
		const txnDate = new Date(t.date);
		if (txnDate.getFullYear() === currentYear) {
			filteredTxns.push({ ...t, date: txnDate });
		}
	});

	filteredTxns.forEach((t) => {
		let currentDate = new Date(t.date);
		while (
			currentDate.getFullYear() === currentYear ||
			currentDate.getFullYear() === currentYear + 1
		) {
			const newTxn: Item = {
				...t,
				date: new Date(currentDate),
				id: Crypto.randomUUID(),
			};
			createdTxnsForTwoYears.push(newTxn);
			switch (t.recurrence) {
				case 'daily':
					currentDate = add(currentDate, { days: 1 });
					break;
				case 'weekly':
					currentDate = add(currentDate, { weeks: 1 });
					break;
				case 'monthly':
					currentDate = add(currentDate, { months: 1 });
					break;
				case 'yearly':
					currentDate = add(currentDate, { years: 1 });
					break;
				case 'custom':
					if (t.recurrenceInterval) {
						currentDate = add(currentDate, {
							days: t.recurrenceInterval,
						});
					}
					break;
				default:
					currentDate = add(currentDate, { years: 2 });
			}
		}
	});
	return createdTxnsForTwoYears;
}
