import { createJSONStorage } from 'zustand/middleware';
import { persistStorage } from './persistStorage';

const dateReviver = (_key: string, value: unknown) => {
	if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
		const date = new Date(value);
		if (!Number.isNaN(date.getTime())) {
			return date;
		}
	}
	return value;
};

export const dateStorage = createJSONStorage(() => persistStorage, {
	reviver: dateReviver,
});
