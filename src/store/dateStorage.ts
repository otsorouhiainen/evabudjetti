import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

const dateReviver = (_key: string, value: unknown) => {
	if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
		const date = new Date(value);
		if (!Number.isNaN(date.getTime())) {
			return date;
		}
	}
	return value;
};

export const dateStorage = createJSONStorage(() => AsyncStorage, {
	reviver: dateReviver,
});
