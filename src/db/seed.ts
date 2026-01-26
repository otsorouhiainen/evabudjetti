import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';
import { db } from './client';
import { categories } from './schema';

export const seedCategories = async () => {
	if (Platform.OS === 'web') return;

	try {
		// Check if categories exist
		const existing = await db.select().from(categories).limit(1);

		if (existing.length > 0) {
			return;
		}

		console.log('Seeding default categories...');

		const defaultCategories = [
			{ name: 'Living', type: 'expense', color: '#FF5733', icon: 'home' },
			{
				name: 'Groceries',
				type: 'expense',
				color: '#33FF57',
				icon: 'cart',
			},
			{ name: 'Salary', type: 'income', color: '#3357FF', icon: 'cash' },
			{
				name: 'Benefits',
				type: 'income',
				color: '#FF33A1',
				icon: 'gift',
			},
		] as const;

		await db.insert(categories).values(
			defaultCategories.map((cat) => ({
				id: Crypto.randomUUID(),
				name: cat.name,
				type: cat.type,
				color: cat.color,
				icon: cat.icon,
			})),
		);

		console.log('Default categories seeded successfully');
	} catch (error) {
		console.error('Error seeding categories:', error);
	}
};
