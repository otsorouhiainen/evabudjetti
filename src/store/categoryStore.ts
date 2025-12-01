import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface Category {
	id: string;
	name: string;
	type: 'income' | 'expense';
	color?: string | null;
	icon?: string | null;
}

interface CategoryStore {
	categories: Category[];
	loading: boolean;
	error: string | null;

	// Actions
	addCategory: (category: Category) => Promise<void>;
	removeCategory: (id: string) => void;
	replaceAll: (items: Category[]) => void;
}

export const useCategoryStore = create<CategoryStore>()(
	persist(
		(set) => ({
			categories: [],
			loading: false,
			error: null,

			addCategory: async (category: Category) => {
				set({ loading: true, error: null });
				try {
					// update in-memory state; persist middleware will save to AsyncStorage
					set((state) => ({
						categories: [...state.categories, category],
						loading: false,
					}));
				} catch (err) {
					console.error('Failed to add category:', err);
					set({ error: 'Failed to add category', loading: false });
				}
			},

			removeCategory: (id: string) => {
				set((state) => ({
					categories: state.categories.filter((c) => c.id !== id),
				}));
			},

			replaceAll: (items: Category[]) => {
				set({ categories: items });
			},
		}),
		{
			name: 'categories-storage',
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
