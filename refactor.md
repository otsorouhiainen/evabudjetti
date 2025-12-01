# Project Refactoring Instructions: Switch to Drizzle ORM & Fix Critical Bugs

## Context
This project is an Expo React Native app (Web + Mobile) using Tamagui for UI. 
Currently, the data layer is broken/disconnected:
1. It attempts to use `@prisma/react-native`, which is incompatible with Expo Web.
2. It uses Zustand for state but saves to `AsyncStorage` instead of a relational DB.
3. There are critical logic errors (hardcoded IDs) and disconnected UI elements (hardcoded categories).

## Objective
Refactor the entire data layer to use **Drizzle ORM** with **expo-sqlite**. This stack is chosen because it supports both Mobile (native SQLite) and Web (via WASM/IndexedDB) seamlessly.

## Action Plan

### 1. Dependency Cleanup
- **Remove** the following incompatible or erroneous packages:
  - `@prisma/react-native`
  - `@prisma/client`
  - `react-native-quick-base64`
  - `nodejs` (invalid dependency)
  - `install` (invalid dependency)
- **Install** the new data stack:
  - `drizzle-orm`
  - `drizzle-kit` (dev dependency)
  - `expo-sqlite`
  - `babel-plugin-inline-import` (required for bundling migrations)

### 2. Database Setup (Drizzle + Expo SQLite)
- Create a Drizzle schema file (e.g., `src/db/schema.ts`) that replicates the logic from the old `prisma/schema.prisma`. 
  - **Tables needed:** `Budget`, `Category`, `Transaction` (combining OneTime/Recurring logic if preferred, or keeping separate), `AppSettings`.
  - **Important:** Ensure `Category` has a `type` (Income/Expense) field.
- Configure Drizzle:
  - Create `drizzle.config.ts`.
  - Update `babel.config.js` to include the inline-import plugin for `.sql` files.
  - Create a database initialization file (e.g., `src/db/client.ts`) that initializes `expo-sqlite` and passes it to Drizzle. **Verify this setup works for both Web and Native.**

### 3. Critical Logic Fixes (Must be addressed during refactor)
- **Fix "Delete All" Bug:** In `app/add_transaction.tsx`, the `handleSubmit` function currently hardcodes `{ id: 1 }`. 
  - *Correction:* Ensure the new Drizzle logic generates a unique UUID (or CUID) for every new transaction.
- **Fix Typo:** Rename `reoccurence` to `recurrence` throughout the codebase.
- **Fix "Add Category" Placeholder:** The "Add Category" modal in `add_transaction.tsx` does nothing.
  - *Correction:* Wire this to an actual Drizzle insert query to save the new category to the DB.

### 4. Integration & State Management
- **Refactor Stores:** Update or replace `useRealTransactionsStore.ts` and `usePlannedTransactionsStore.ts`.
  - Instead of persisting to `AsyncStorage` manually, these stores (or a new query hook layer) should read/write directly to the SQLite database via Drizzle.
  - Consider using Drizzle's `useLiveQuery` (if available/stable) or simple `useEffect` fetchers within the store to keep the UI in sync.
- **Connect UI to DB:** - In `app/add_transaction.tsx`, replace the hardcoded `CATEGORIES` array with a dynamic query that fetches categories from the `Category` table.

## Summary of Deliverables
1. A clean `package.json` without broken Prisma dependencies.
2. A working Drizzle setup (`schema.ts`, `client.ts`) compatible with Web & Mobile.
3. Functional "Add Transaction" flow that saves to SQLite with unique IDs.
4. Functional "Categories" flow that fetches/saves to SQLite.