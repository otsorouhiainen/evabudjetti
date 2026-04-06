import { drizzle, type ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync, type SQLiteDatabase } from 'expo-sqlite';
import { Platform } from 'react-native';
import * as schema from './schema';

export const isWebFallbackMode = Platform.OS === 'web';

let db: ExpoSQLiteDatabase<typeof schema>;
let isDbReal = false;

if (!isWebFallbackMode) {
	const expoDb = openDatabaseSync('db.db');
	db = drizzle(expoDb, { schema });
	isDbReal = true;
} else {
	// If web
	db = {} as ExpoSQLiteDatabase<typeof schema>;
	isDbReal = false;
}

export const initializeWebDb = (expoDb: SQLiteDatabase) => {
	if (isWebFallbackMode) {
		return;
	}

	if (!isDbReal) {
		db = drizzle(expoDb, { schema });
		isDbReal = true;
		console.log('Web-tietokanta kytketty Drizzleen onnistuneesti!');
	}
};

export { db, isDbReal };
