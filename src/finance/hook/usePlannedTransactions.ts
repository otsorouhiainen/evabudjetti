import useWebFallbackPlannedTransactionsStore from '@/src/store/useWebFallbackPlannedTransactionsStore';

/*
 * WEB-FALLBACK: This hook is used in the web version of the app, where we don't have access to the native database.
 * The .native.ts is used automatically on actual devices.
 */
export function usePlannedTransactions() {
	const fallbackStoreTransactions = useWebFallbackPlannedTransactionsStore(
		(state) => state.transactions,
	);

	return fallbackStoreTransactions;
}
