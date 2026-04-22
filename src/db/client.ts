import { drizzle, type ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import type { SQLiteDatabase } from 'expo-sqlite';
import migrations from '@/drizzle/migrations';
import * as schema from './schema';

let db: ExpoSQLiteDatabase<typeof schema>;
let isDbInitialized: boolean = false;

export async function initializeDb(expoDb: SQLiteDatabase) {
	db = drizzle(expoDb, {
		schema,
	});

	await migrate(db, migrations);
	isDbInitialized = true;

	console.log('DB initialized');
}

export { db, isDbInitialized };
