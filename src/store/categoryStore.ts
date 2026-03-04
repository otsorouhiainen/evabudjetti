import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Category, Persisted } from '../dataModel';

interface CategoryStore {
	categories: Persisted<Category>[];
	loading: boolean;
	error: string | null;
	nextId: number;

	// Actions
	addCategory: (category: Category) => Promise<void>;
	removeCategory: (id: number) => void;
	replaceAll: (items: Persisted<Category>[]) => void;
}

export const useCategoryStore = create<CategoryStore>()(
	persist(
		(set) => ({
			categories: [],
			loading: false,
			error: null,
			nextId: 1,

			addCategory: async (category: Category) => {
				set({ loading: true, error: null });
				try {
					// update in-memory state; persist middleware will save to AsyncStorage
					set((state) => ({
						categories: [
							...state.categories,
							{ ...category, id: state.nextId },
						],
						loading: false,
						nextId: state.nextId + 1,
					}));
				} catch (err) {
					console.error('Failed to add category:', err);
					set({ error: 'Failed to add category', loading: false });
				}
			},

			removeCategory: (id: number) => {
				set((state) => ({
					categories: state.categories.filter((c) => c.id !== id),
				}));
			},

			replaceAll: (items: Persisted<Category>[]) => {
				set({ categories: items });
			},
		}),
		{
			name: 'categories-storage',
			storage: createJSONStorage(() => AsyncStorage),
			version: 1,
		},
	),
);
