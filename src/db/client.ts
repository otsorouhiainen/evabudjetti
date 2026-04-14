import { drizzle, type ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import { Platform } from 'react-native';
import * as schema from './schema';

let db: ExpoSQLiteDatabase<typeof schema>;
let isDbReal: boolean;

if (Platform.OS !== 'web') {
	const expoDb = openDatabaseSync('db.db');
	db = drizzle(expoDb, {
		schema,
	});
	isDbReal = true;
} else {
	db = {} as ExpoSQLiteDatabase<typeof schema>;
	isDbReal = false;
}

export { db, isDbReal };
