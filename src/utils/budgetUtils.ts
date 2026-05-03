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
