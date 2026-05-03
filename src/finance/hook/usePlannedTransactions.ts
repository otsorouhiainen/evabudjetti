import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { db, isDbReal } from '@/src/db/client';
import * as schema from '@/src/db/schema';
import useWebFallbackPlannedTransactionsStore from '@/src/store/useWebFallbackPlannedTransactionsStore';

export function usePlannedTransactions() {
	const fallbackStoreTransactions = useWebFallbackPlannedTransactionsStore(
		(state) => state.transactions,
	);

	const { data } = useLiveQuery(db.select().from(schema.plannedTransactions));

	return isDbReal ? (data ?? []) : fallbackStoreTransactions;
}
