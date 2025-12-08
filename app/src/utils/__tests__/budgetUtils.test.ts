import type { Item } from '../../../../src/constants/wizardConfig';
import {
	formatCurrency,
	isValidDate,
	parseTxnDate,
	splitTransactions,
} from '../budgetUtils';

describe('budgetUtils', () => {
	describe('parseTxnDate', () => {
		it('should parse "dd.mm.yyyy" string correctly', () => {
			const date = parseTxnDate('15.01.2023');
			expect(date.getFullYear()).toBe(2023);
			expect(date.getMonth()).toBe(0); // Months are 0-indexed
			expect(date.getDate()).toBe(15);
		});
	});

	describe('splitTransactions', () => {
		it('should split transactions into past and future based on reference date', () => {
			const refDate = new Date(2023, 5, 15); // June 15, 2023
			const pastTx: Item = {
				id: '1',
				name: 'Past',
				category: 'Food',
				type: 'expense',
				amount: 10,
				recurrence: 'none',
				date: new Date(2023, 5, 10),
			};
			const futureTx: Item = {
				id: '2',
				name: 'Future',
				category: 'Food',
				type: 'expense',
				amount: 20,
				recurrence: 'none',
				date: new Date(2023, 5, 20),
			};

			const result = splitTransactions([pastTx, futureTx], refDate);

			expect(result.past).toContain(pastTx);
			expect(result.past).not.toContain(futureTx);

			expect(result.future).toContain(futureTx);
			expect(result.future).not.toContain(pastTx);
		});
	});

	describe('formatCurrency', () => {
		it('should format number to EUR currency', () => {
			// Note: The specific output depends on the locale 'fi-FI', which writes 12,34 instead of 12.34
			// and places symbol correctly.
			const result = formatCurrency(1234.56);
			// Normalized check to avoid whitespace issues (non-breaking spaces etc)
			expect(result.replace(/\s/g, '')).toMatch(/1234,56€|€1234,56/);
		});

		it('should hide sign/symbol if requested or behave according to spec', () => {
			// Looking at implementation: signDisplay: hideSign ? 'never' : 'auto'
			const result = formatCurrency(1234, true);
			// It's still currency style, but sign (plus/minus) might be affected.
			// Actually signDisplay 'never' suppresses the sign for negative numbers too? or just the +?
			// Let's test negative.
			const negResult = formatCurrency(-100, true);
			expect(negResult).not.toContain('-');
		});
	});

	describe('isValidDate', () => {
		it('should return true for valid "d.m.yyyy" or "dd.mm.yyyy" string', () => {
			expect(isValidDate('1.1.2023')).toBe(true);
			expect(isValidDate('01.01.2023')).toBe(true);
			expect(isValidDate('28.02.2023')).toBe(true);
		});

		it('should return false for invalid formats', () => {
			expect(isValidDate('invalid')).toBe(false);
			expect(isValidDate('2023-01-01')).toBe(false); // only dots/slashes supported by regex
		});

		it('should return false for non-existent dates', () => {
			expect(isValidDate('31.02.2023')).toBe(false); // Feb 31st doesn't exist
		});
	});
});
