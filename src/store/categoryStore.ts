import { Platform } from 'react-native';
import { create } from 'zustand';
import { db } from '../db/client';
import { categories as categoriesSchema } from '../db/schema';

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
	fetchCategories: () => Promise<void>;
	addCategory: (category: Category) => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
	categories: [],
	loading: false,
	error: null,

	fetchCategories: async () => {
		set({ loading: true, error: null });
		try {
			if (Platform.OS === 'web') {
				// Web: Load from localStorage
				const stored = localStorage.getItem('categories');
				const categories = stored ? JSON.parse(stored) : [];
				set({ categories, loading: false });
			} else {
				// Native: Load from Drizzle
				const data = await db.select().from(categoriesSchema);
				set({ categories: data, loading: false });
			}
		} catch (error) {
			console.error('Failed to fetch categories:', error);
			set({ error: 'Failed to fetch categories', loading: false });
		}
	},

	addCategory: async (category: Category) => {
		set({ loading: true, error: null });
		try {
			if (Platform.OS === 'web') {
				// Web: Save to localStorage
				const currentCategories = get().categories;
				const updatedCategories = [...currentCategories, category];
				localStorage.setItem(
					'categories',
					JSON.stringify(updatedCategories),
				);
				set({ categories: updatedCategories, loading: false });
			} else {
				// Native: Save to Drizzle
				await db.insert(categoriesSchema).values(category);
				// Refresh list
				await get().fetchCategories();
			}
		} catch (error) {
			console.error('Failed to add category:', error);
			set({ error: 'Failed to add category', loading: false });
		}
	},
}));
