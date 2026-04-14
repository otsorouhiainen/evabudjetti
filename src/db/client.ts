import { drizzle, type ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import { Platform } from 'react-native';
import * as schema from './schema';

let db: ExpoSQLiteDatabase<typeof schema>;
let isDbReal = false;

if (Platform.OS !== 'web') {
	const expoDb = openDatabaseSync('db.db');
	db = drizzle(expoDb, { schema });
	isDbReal = true;
} else {
	// If web
	db = {} as ExpoSQLiteDatabase<typeof schema>;
	isDbReal = false;
}

export const initializeWebDb = (expoDb: any) => {
	if (Platform.OS === 'web' && !isDbReal) {
		db = drizzle(expoDb, { schema });
		isDbReal = true;
		console.log('Web-tietokanta kytketty Drizzleen onnistuneesti!');
	}
};

export { db, isDbReal };
