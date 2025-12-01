import { drizzle, type ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

const expoDb = openDatabaseSync('db.db');
export const db: ExpoSQLiteDatabase<typeof schema> = drizzle(expoDb, {
	schema,
});
