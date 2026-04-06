import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import type { StateStorage } from 'zustand/middleware';

const INDEXED_DB_NAME = 'evabudjetti';
const INDEXED_DB_STORE_NAME = 'zustand';
const INDEXED_DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function getIndexedDb(): Promise<IDBDatabase> {
	if (dbPromise !== null) {
		return dbPromise;
	}

	dbPromise = new Promise((resolve, reject) => {
		const request = indexedDB.open(INDEXED_DB_NAME, INDEXED_DB_VERSION);

		request.onupgradeneeded = () => {
			const db = request.result;
			if (!db.objectStoreNames.contains(INDEXED_DB_STORE_NAME)) {
				db.createObjectStore(INDEXED_DB_STORE_NAME);
			}
		};

		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});

	return dbPromise;
}

const indexedDbStorage: StateStorage = {
	getItem: async (name: string) => {
		if (typeof indexedDB === 'undefined') {
			return null;
		}

		const db = await getIndexedDb();

		return new Promise<string | null>((resolve, reject) => {
			const transaction = db.transaction(
				INDEXED_DB_STORE_NAME,
				'readonly',
			);
			const store = transaction.objectStore(INDEXED_DB_STORE_NAME);
			const request = store.get(name);

			request.onsuccess = () => {
				const value = request.result;
				resolve(typeof value === 'string' ? value : null);
			};
			request.onerror = () => reject(request.error);
		});
	},

	setItem: async (name: string, value: string) => {
		if (typeof indexedDB === 'undefined') {
			return;
		}

		const db = await getIndexedDb();

		await new Promise<void>((resolve, reject) => {
			const transaction = db.transaction(
				INDEXED_DB_STORE_NAME,
				'readwrite',
			);
			const store = transaction.objectStore(INDEXED_DB_STORE_NAME);
			const request = store.put(value, name);

			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	},

	removeItem: async (name: string) => {
		if (typeof indexedDB === 'undefined') {
			return;
		}

		const db = await getIndexedDb();

		await new Promise<void>((resolve, reject) => {
			const transaction = db.transaction(
				INDEXED_DB_STORE_NAME,
				'readwrite',
			);
			const store = transaction.objectStore(INDEXED_DB_STORE_NAME);
			const request = store.delete(name);

			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	},
};

export const persistStorage: StateStorage =
	Platform.OS === 'web' ? indexedDbStorage : AsyncStorage;
