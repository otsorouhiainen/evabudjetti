import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { db } from '@/src/db/client';
import * as schema from '@/src/db/schema';

export function usePlannedTransactions() {
	const { data } = useLiveQuery(db.select().from(schema.plannedTransactions));

	return data ?? [];
}
