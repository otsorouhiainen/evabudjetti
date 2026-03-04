ALTER TABLE `transactions` RENAME TO `planned_transactions`;--> statement-breakpoint
ALTER TABLE `planned_transactions` RENAME COLUMN "recurrence" TO "recurrence_base";--> statement-breakpoint
CREATE TABLE `accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`budget_id` integer NOT NULL,
	`name` text NOT NULL,
	FOREIGN KEY (`budget_id`) REFERENCES `budgets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `balance_reconciliations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`account_id` integer NOT NULL,
	`date` integer NOT NULL,
	`amount` real NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `budgets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `real_transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`account_id` integer NOT NULL,
	`name` text NOT NULL,
	`category_id` integer NOT NULL,
	`amount` real NOT NULL,
	`date` integer NOT NULL,
	`type` text NOT NULL,
	`planned_transaction_id` integer,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_planned_transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`account_id` integer NOT NULL,
	`name` text NOT NULL,
	`category_id` integer NOT NULL,
	`amount` real NOT NULL,
	`date` integer NOT NULL,
	`end_date` integer,
	`type` text NOT NULL,
	`recurrence_base` text,
	`recurrence_interval` integer NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_planned_transactions`("id", "account_id", "name", "category_id", "amount", "date", "end_date", "type", "recurrence_base", "recurrence_interval") SELECT "id", "account_id", "name", "category_id", "amount", "date", "end_date", "type", "recurrence_base", "recurrence_interval" FROM `planned_transactions`;--> statement-breakpoint
DROP TABLE `planned_transactions`;--> statement-breakpoint
ALTER TABLE `__new_planned_transactions` RENAME TO `planned_transactions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`color` text,
	`icon` text
);
--> statement-breakpoint
INSERT INTO `__new_categories`("id", "name", "type", "color", "icon") SELECT "id", "name", "type", "color", "icon" FROM `categories`;--> statement-breakpoint
DROP TABLE `categories`;--> statement-breakpoint
ALTER TABLE `__new_categories` RENAME TO `categories`;