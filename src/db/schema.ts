import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const transactions = sqliteTable('transactions', {
	id: text('id').primaryKey(), // UUID
	name: text('name').notNull(), // mapped from description/name
	amount: real('amount').notNull(),
	date: integer('date', { mode: 'timestamp' }).notNull(),
	categoryId: text('category_id'),
	type: text('type').$type<'income' | 'expense'>().notNull(),
	recurrence: text('recurrence')
		.$type<'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'>()
		.notNull()
		.default('none'),
	recurrenceInterval: integer('recurrence_interval'),
	isPlanned: integer('is_planned', { mode: 'boolean' })
		.notNull()
		.default(false),
});

export const categories = sqliteTable('categories', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	type: text('type').$type<'income' | 'expense'>().notNull(),
	color: text('color'),
	icon: text('icon'),
});

export const appSettings = sqliteTable('app_settings', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	key: text('key').notNull().unique(),
	value: text('value').notNull(),
});
