import { drizzle, type ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import { Platform } from 'react-native';
import * as schema from './schema';

let db: ExpoSQLiteDatabase<typeof schema>;

if (Platform.OS !== 'web') {
	const expoDb = openDatabaseSync('db.db');
	db = drizzle(expoDb, {
		schema,
	});
} else {
	db = {} as any;
}

export { db };
