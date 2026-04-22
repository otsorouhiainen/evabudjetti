import { formatCurrency } from '../budgetUtils';

describe('budgetUtils', () => {
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
			const _result = formatCurrency(1234, true);
			// It's still currency style, but sign (plus/minus) might be affected.
			// Actually signDisplay 'never' suppresses the sign for negative numbers too? or just the +?
			// Let's test negative.
			const negResult = formatCurrency(-100, true);
			expect(negResult).not.toContain('-');
		});
	});
});
