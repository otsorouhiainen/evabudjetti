/// Fake data for testing
//  had to run 'pnpm add -D @types/node' to get this working
//  prisma.config.ts added to root to get following commands working
//  First run 'pnpm prisma migrate dev' to init prisma
//  then run 'pnpm prisma seed' to add the data locally
//  then 'pnpm prisma studio' if you want to explore data in your browser

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	//===========================================================
	//							INIT
	//===========================================================
	const _budget = await prisma.budget.create({
		data: {}, //uses default data
	});

	const _spending = await prisma.spending.create({
		data: {},
	});

	//===========================================================
	//					EXPENSE CATEGORIES
	//===========================================================
	const category_living = await prisma.category.create({
		data: { name: 'living', type: 'EXPENSE' },
	});
	const category_groceries = await prisma.category.create({
		data: { name: 'groceries', type: 'EXPENSE' },
	});
	const category_hobbies = await prisma.category.create({
		data: { name: 'hobbies', type: 'EXPENSE' },
	});
	const category_transportation = await prisma.category.create({
		data: { name: 'transportation', type: 'EXPENSE' },
	});
	const category_savings = await prisma.category.create({
		data: { name: 'Savings', type: 'EXPENSE' },
	});

	//===========================================================
	//					INCOME CATEGORIES
	//===========================================================
	const category_employment = await prisma.category.create({
		data: { name: 'employment', type: 'INCOME' },
	});
	const category_investments = await prisma.category.create({
		data: { name: 'investments', type: 'INCOME' },
	});
	const category_poker = await prisma.category.create({
		data: { name: 'poker', type: 'INCOME' },
	});
	const category_blackjack = await prisma.category.create({
		data: { name: 'blackjack', type: 'INCOME' },
	});
	const category_roulette = await prisma.category.create({
		data: { name: 'roulette', type: 'INCOME' },
	});

	//===========================================================
	//					RECURRING TRANSACTIONS
	//===========================================================
	const _recurring_expenses = await prisma.recurringTransaction.createMany({
		data: [
			{
				description: 'Bus card',
				amount: 45,
				rrule: 'FREQ=MONTHLY',
				categoryId: category_transportation.id,
			},
			{
				description: 'Netflix',
				amount: 20,
				rrule: 'FREQ=MONTHLY',
				categoryId: category_hobbies.id,
			},
			{
				description: 'Electricity bill',
				amount: 20,
				rrule: 'FREQ=MONTHLY',
				categoryId: category_living.id,
			},

			// Expense data below is AI-GENERATED

			// LIVING
			{
				description: 'Internet bill',
				amount: 60,
				rrule: 'FREQ=MONTHLY',
				categoryId: category_living.id,
			},
			{
				description: 'Water bill',
				amount: 35,
				rrule: 'FREQ=MONTHLY',
				categoryId: category_living.id,
			},

			// GROCERIES
			{
				description: 'Milk delivery',
				amount: 12,
				rrule: 'FREQ=WEEKLY',
				categoryId: category_groceries.id,
			},

			// HOBBIES
			{
				description: 'Netflix',
				amount: 20,
				rrule: 'FREQ=MONTHLY',
				categoryId: category_hobbies.id,
			},
			{
				description: 'Gym membership',
				amount: 50,
				rrule: 'FREQ=MONTHLY',
				categoryId: category_hobbies.id,
			},
			{
				description: 'Spotify',
				amount: 11.99,
				rrule: 'FREQ=MONTHLY',
				categoryId: category_hobbies.id,
			},

			// TRANSPORTATION
			{
				description: 'Bus card',
				amount: 45,
				rrule: 'FREQ=MONTHLY',
				categoryId: category_transportation.id,
			},
			{
				description: 'Car insurance',
				amount: 110,
				rrule: 'FREQ=MONTHLY',
				categoryId: category_transportation.id,
			},

			// SAVINGS
			{
				description: 'Automatic savings transfer',
				amount: 250,
				rrule: 'FREQ=MONTHLY',
				categoryId: category_savings.id,
			},
		],
	});

	//===========================================================
	//					ONE TIME TRANSACTIONS
	//===========================================================
	const _irregular_expenses = await prisma.oneTimeTransaction.createMany({
		data: [
			{
				description: 'Champagne',
				amount: 60,
				date: new Date('1998-01-18T23:00:00Z'),
				categoryId: category_transportation.id,
			},
			{
				description: 'Paraphernalia',
				amount: 20,
				date: new Date('1999-01-28T22:00:00Z'),
				categoryId: category_hobbies.id,
			},
			{
				description: 'Harmonica',
				amount: 20,
				date: new Date('1964-01-18T17:00:00Z'),
				categoryId: category_living.id,
			},

			// Expense data below is AI-GENERATED

			// LIVING EXPENSES
			{
				description: 'Monthly rent',
				amount: 1200,
				date: new Date('2025-01-05T10:00:00Z'),
				categoryId: category_living.id,
			},
			{
				description: 'Furniture delivery',
				amount: 350,
				date: new Date('2024-12-20T14:30:00Z'),
				categoryId: category_living.id,
			},
			{
				description: 'Home insurance',
				amount: 89,
				date: new Date('2024-11-15T09:15:00Z'),
				categoryId: category_living.id,
			},

			// GROCERIES
			{
				description: 'Weekly groceries',
				amount: 127.5,
				date: new Date('2025-01-08T16:45:00Z'),
				categoryId: category_groceries.id,
			},
			{
				description: 'Farmers market produce',
				amount: 45,
				date: new Date('2025-01-06T10:20:00Z'),
				categoryId: category_groceries.id,
			},
			{
				description: 'Bulk buy - pantry items',
				amount: 89.99,
				date: new Date('2024-12-28T11:00:00Z'),
				categoryId: category_groceries.id,
			},

			// HOBBIES
			{
				description: 'Concert tickets',
				amount: 95,
				date: new Date('2025-01-10T18:00:00Z'),
				categoryId: category_hobbies.id,
			},
			{
				description: 'Gaming mouse',
				amount: 65,
				date: new Date('2024-12-25T12:00:00Z'),
				categoryId: category_hobbies.id,
			},
			{
				description: 'Book purchase',
				amount: 34.99,
				date: new Date('2024-12-10T14:30:00Z'),
				categoryId: category_hobbies.id,
			},

			// TRANSPORTATION
			{
				description: 'Gas fill-up',
				amount: 58,
				date: new Date('2025-01-08T08:30:00Z'),
				categoryId: category_transportation.id,
			},
			{
				description: 'Car maintenance',
				amount: 120,
				date: new Date('2024-12-29T09:00:00Z'),
				categoryId: category_transportation.id,
			},
			{
				description: 'Uber ride',
				amount: 22.5,
				date: new Date('2025-01-07T22:15:00Z'),
				categoryId: category_transportation.id,
			},

			// SAVINGS
			{
				description: 'Emergency fund deposit',
				amount: 500,
				date: new Date('2025-01-01T10:00:00Z'),
				categoryId: category_savings.id,
			},
			{
				description: 'Vacation fund',
				amount: 200,
				date: new Date('2024-12-15T15:00:00Z'),
				categoryId: category_savings.id,
			},
			{
				description: 'Investment transfer',
				amount: 300,
				date: new Date('2024-11-30T09:30:00Z'),
				categoryId: category_savings.id,
			},

			// INCOME - EMPLOYMENT
			{
				description: 'Monthly salary',
				amount: 4500,
				date: new Date('2025-01-01T08:00:00Z'),
				categoryId: category_employment.id,
			},
			{
				description: 'Bonus payout',
				amount: 800,
				date: new Date('2024-12-20T08:00:00Z'),
				categoryId: category_employment.id,
			},
			{
				description: 'Freelance project',
				amount: 350,
				date: new Date('2025-01-05T14:00:00Z'),
				categoryId: category_employment.id,
			},

			// INCOME - INVESTMENTS
			{
				description: 'Dividend payment',
				amount: 125,
				date: new Date('2024-12-31T09:00:00Z'),
				categoryId: category_investments.id,
			},
			{
				description: 'Interest earned',
				amount: 45.6,
				date: new Date('2025-01-02T08:30:00Z'),
				categoryId: category_investments.id,
			},

			// INCOME - POKER
			{
				description: 'Vegas trip winnings',
				amount: 450,
				date: new Date('2024-12-18T02:30:00Z'),
				categoryId: category_poker.id,
			},
			{
				description: 'Friday night game',
				amount: 180,
				date: new Date('2025-01-03T23:45:00Z'),
				categoryId: category_poker.id,
			},
			{
				description: 'Online tournament',
				amount: 220,
				date: new Date('2024-12-28T21:00:00Z'),
				categoryId: category_poker.id,
			},

			// INCOME - BLACKJACK
			{
				description: 'Casino session',
				amount: 95,
				date: new Date('2024-12-26T18:00:00Z'),
				categoryId: category_blackjack.id,
			},
			{
				description: 'Card counting win',
				amount: 310,
				date: new Date('2025-01-04T20:30:00Z'),
				categoryId: category_blackjack.id,
			},

			// INCOME - ROULETTE
			{
				description: 'Lucky spin',
				amount: 150,
				date: new Date('2024-12-23T19:15:00Z'),
				categoryId: category_roulette.id,
			},
			{
				description: 'Roulette winnings',
				amount: 275,
				date: new Date('2025-01-06T21:00:00Z'),
				categoryId: category_roulette.id,
			},
		],
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
