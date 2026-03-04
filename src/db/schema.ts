/**
 * Defines the database schema for the application using Drizzle ORM's SQLite core.
 *
 * NOTE: After changes to the schema, remember to generate a migration with a name describing the change:
 * pnpm drizzle-kit generate --name=your_migration_name
 */

import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const budgets = sqliteTable('budgets', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
});

export const accounts = sqliteTable('accounts', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	budgetId: integer('budget_id')
		.notNull()
		.references(() => budgets.id),
	name: text('name').notNull(),
});

export const balanceReconciliations = sqliteTable('balance_reconciliations', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	accountId: integer('account_id')
		.notNull()
		.references(() => accounts.id),
	date: integer('date', { mode: 'timestamp' }).notNull(),
	amount: real('amount').notNull(),
});

export const plannedTransactions = sqliteTable('planned_transactions', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	accountId: integer('account_id')
		.notNull()
		.references(() => accounts.id),
	name: text('name').notNull(),
	categoryId: integer('category_id')
		.notNull()
		.references(() => categories.id),
	amount: real('amount').notNull(),
	startDate: integer('date', { mode: 'timestamp' }).notNull(),
	endDate: integer('end_date', { mode: 'timestamp' }),
	type: text('type').$type<'income' | 'expense'>().notNull(),
	recurrenceBase: text('recurrence_base').$type<
		'day' | 'week' | 'month' | 'year'
	>(),
	recurrenceInterval: integer('recurrence_interval').notNull(),
});

export const realTransactions = sqliteTable('real_transactions', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	accountId: integer('account_id')
		.notNull()
		.references(() => accounts.id),
	name: text('name').notNull(),
	categoryId: integer('category_id')
		.notNull()
		.references(() => categories.id),
	amount: real('amount').notNull(),
	date: integer('date', { mode: 'timestamp' }).notNull(),
	type: text('type').$type<'income' | 'expense'>().notNull(),
	plannedTransactionId: integer('planned_transaction_id'),
});

export const categories = sqliteTable('categories', {
	id: integer('id').primaryKey({ autoIncrement: true }),
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
