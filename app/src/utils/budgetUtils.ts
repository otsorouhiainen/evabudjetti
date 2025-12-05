import type { Item } from '../../../src/constants/wizardConfig';
// ./src/utils/budgetUtils.ts
export function parseTxnDate(dateStr: string): Date {
	const [day, month, year] = dateStr.split('.').map(Number);
	return new Date(year, month - 1, day);
}

export function splitTransactions(transactions: Item[], referenceDate: Date) {
	const normalizedDate = new Date(referenceDate);
	normalizedDate.setHours(0, 0, 0, 0);

	const past: Item[] = [];
	const future: Item[] = [];

	for (const tx of transactions) {
		if (tx.date < referenceDate) {
			past.push(tx);
		} else {
			future.push(tx);
		}
	}
	// Get only 7 past and future txns
	return { past: past.slice(0, 7), future: future.slice(0,7) };
}

export function formatCurrency(value: number, hideSign?: boolean) {
	return Intl.NumberFormat('fi-FI', {
		style: 'currency',
		currency: 'EUR',
		signDisplay: hideSign ? 'never' : 'auto',
		unitDisplay: 'narrow',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(value);
}

export function isValidDate(text: string): boolean {
	const regex = /^(\d{1,2})[./](\d{1,2})[./](\d{4})$/;
	const match = regex.exec(text);

	if (!match) return false;

	const day = parseInt(match[1], 10);
	const month = parseInt(match[2], 10) - 1;
	const year = parseInt(match[3], 10);

	const date = new Date(year, month, day);

	return (
		date.getFullYear() === year &&
		date.getMonth() === month &&
		date.getDate() === day
	);
}
