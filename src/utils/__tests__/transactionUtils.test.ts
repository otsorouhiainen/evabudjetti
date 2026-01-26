import type { Item } from '../../constants/wizardConfig';
import { generateTransactionsForTwoYears } from '../transactionUtils';

// Mock expo-crypto
jest.mock('expo-crypto', () => ({
	randomUUID: jest.fn(() => 'test-uuid'),
}));

describe('transactionUtils', () => {
	describe('generateTransactionsForTwoYears', () => {
		it('should generate monthly transactions for current and next year', () => {
			const now = new Date();
			const currentYear = now.getFullYear();
			const inputItem: Item = {
				id: '1',
				name: 'Salary',
				category: 'Income',
				type: 'income',
				amount: 3000,
				recurrence: 'monthly',
				date: new Date(currentYear, 0, 15), // Jan 15th
			};

			const result = generateTransactionsForTwoYears([inputItem]);

			// Checks that we have transactions for the rest of current year and next year
			// Jan 15th is passed. If today is Dec, we might have few.
			// But the function logic iterates: while year is current or next.
			// So it should generate from the *original date* (but logic might use input date as start).

			// Let's verify the logic in transactionUtils briefly:
			// filteredTxns only keeps items where txnDate.getFullYear() === currentYear
			// Then for each, loop while year is current or next.

			expect(result.length).toBeGreaterThan(0);

			// Check first item
			expect(result[0].name).toBe('Salary');
			expect(result[0].id).toBe('test-uuid');

			// Verify years
			const years = result.map((t) => t.date.getFullYear());
			const uniqueYears = Array.from(new Set(years));
			expect(uniqueYears).toContain(currentYear);
			expect(uniqueYears).toContain(currentYear + 1);
			expect(uniqueYears).not.toContain(currentYear + 2);
		});

		it('should generate yearly transactions', () => {
			const now = new Date();
			const currentYear = now.getFullYear();
			const inputItem: Item = {
				id: '2',
				name: 'Updates',
				category: 'Software',
				type: 'expense',
				amount: 100,
				recurrence: 'yearly',
				date: new Date(currentYear, 5, 1), // June 1st
			};

			const result = generateTransactionsForTwoYears([inputItem]);

			// Should be one for this year and one for next year
			expect(result.length).toBe(2);
			expect(result[0].date.getFullYear()).toBe(currentYear);
			expect(result[1].date.getFullYear()).toBe(currentYear + 1);
		});
	});
});
