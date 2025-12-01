import { drizzle, type ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import { Platform } from 'react-native';
import * as schema from './schema';

// biome-ignore lint/suspicious/noExplicitAny: DB type inference is complex
let db: ExpoSQLiteDatabase<typeof schema> = {} as any;

if (Platform.OS !== 'web') {
	const expoDb = openDatabaseSync('db.db');
	db = drizzle(expoDb, { schema });
}

export { db };
