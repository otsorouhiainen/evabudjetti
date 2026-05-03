# **EVA MyBudget**

**EVA MyBudget** is a modern, cross-platform budgeting and expense tracking application designed to help you manage your personal finances with ease. Built with performance and scalability in mind using React Native and Expo.

## **✨ Features**

* **📊 Comprehensive Budgeting**: Create and customize your own budget.  
* **🧙‍♂️ Budget Wizard**: Step-by-step wizard to easily set up your initial budget preferences.  
* **💸 Transaction Tracking**: Log both planned expenses/income and "ad-hoc" one-time transactions.  
* **📈 Visual Analytics**: Visualize spending over time and forecast financial longevity.  
* **🌍 Multi-language Support**: Fully localized interface (En/Fi).  
* **📱 Cross-Platform**: Seamless experience on both Android and iOS.

## **🛠 Technologies**

This project leverages a modern stack for robust mobile development:

* [**React Native**](https://reactnative.dev/) **& [Expo](https://expo.dev/)**: For cross-platform mobile development.  
* [**TypeScript**](https://www.typescriptlang.org/): Ensures type safety and scalable code.  
* [**Tamagui**](https://tamagui.dev/): For highly performant and consistent UI components.  
* [**Zustand**](https://github.com/pmndrs/zustand): A small, fast, and scalable bearbones state management solution.  
* [**i18next**](https://www.i18next.com/): For internationalization.  
* [**PNPM**](https://pnpm.io/): Fast, disk space efficient package manager.  
* [**Biome**](https://biomejs.dev/): Fast formatter and linter.
* [**Drizzle**](https://orm.drizzle.team/) **& SQLite**: For local data persistence.

## **🚀 Get Started**

### **Prerequisites**

* Node.js (LTS recommended)  
* [PNPM](https://pnpm.io/installation) installed globally.

### **Installation**

1. **Clone the repository**  
   git clone **REPO_URL_HERE**  
   cd evabudjetti

2. **Install dependencies**  
   pnpm install

### **Running the App**

**Android**  
pnpm expo start  
\# Press 'a' to open on Android Emulator or scan QR code with Expo Go

**iOS**  
pnpm expo start  
\# Press 'i' to open on iOS Simulator or scan QR code with Expo Go

**Web (not recommended)**  
pnpm run web
\# Opens in browser for quick development (does not work completely, discouraged for development use)

## **Project Status**

There have been three groups working on this project as part of a university course. The current state of the project is a nearly complete implementation of basic features, with a rethought app structure. There are still some rough edges and missing features, and the core functionality has some bugs that need to be ironed out. The next group from the course may continue development and maintenance.

| Group | What they did |
| --- | --- |
| Group 1 | UI prototypes, implementation attempt |
| Group 2 | Unfinished reimplementation on the current, more modern stack |
| Group 3 (our group) | Rethinking of the app structure and nearly complete implementation of basic features |

### **Leftovers from the current backlog**

See the open issues for a more detailed list of remaining tasks and bugs.
Our project board is located at https://github.com/users/otsorouhiainen/projects/8/views/1.

Fixing the higher priority bugs from the project board and implementing some of the missing features would be a good starting point for the next group.

### **💡 Development Notes**

For a new group, the "Import repository" functionality on GitHub can be a good way to transition the code to a new repository. It preserves the commit history and makes it easy to set up a new repo with the existing codebase.

When transitioning to a new repo, the CI setup needs to be reconfigured. The current "EAS Build" workflow has been used for providing test APKs for Android. To get it working on a new repo, the secrets for EAS Build need to be set up in the repository settings, and the app.json file needs to be updated with the correct slug, owner and EAS project ID for the EAS Build to work.

If some time has been passed since the last development activity, it is recommended to check for updates to dependencies and update them if necessary. Also, the lint and build CI may need some maintenance to get them working again in case some dependencies have been deprecated.

To properly test and develop new features, each team member should have either an iOS or Android device with the Expo Go app installed.

The web version is not fully functional and should be avoided for development use. Notably, the database the app uses is not reliably functional in the web version. There have been attempts at getting the database working on web and the latest progress in in https://github.com/otsorouhiainen/evabudjetti/pull/175, but some group members reported timeouts while others were able to get it working. The current main branch contains some fallback Zustand stores to replace the database on web, but they are not fully functional and should be considered a temporary solution.

### **Useful documents**

The current development process is described in more detail in our [DEVELOPMENT.md](DEVELOPMENT.md) file. The test report from the third group is located [here](docs/G18-TestRep-v5.pdf), which contains a detailed report of manually tested features and found bugs. The project board of the third group is located [here](https://github.com/users/otsorouhiainen/projects/8/views/1). The final report of the third group should be requested from the customer, as it contains some sensitive information and is not included in the repository. Some of the customer's written requirements (in Finnish) are located [here](docs/Maarittelya_Testitapaukset.pdf).

In the docs/ folder, there is also the first group's initial UI prototypes, from which some design ideas have been taken. The second group's documents have not been included in the repository, as they are not that relevant for the current version, but they can be requested from the customer if needed.

### **📂 Project Structure**

High-level layout and domain flow:

- app/ - Expo Router views and layouts (screens, tabs, nested routes)
- src/components/ - Reusable UI components used by views
- src/dataModel/ - Domain types (transactions, balances, categories, etc.)
- src/finance/ - Domain logic and data orchestration
   - logic/ - Pure calculation logic (balances, summaries, usable funds)
   - query/ - DB reads for finance data
   - hook/ - Public hooks used by views; manages caches and versioning
   - cache/ - In-memory caches (Zustand) for occurrences, balances, summaries
   - versioning/ - Month-level invalidation state for caches
- src/db/ - Drizzle schema and client setup
- src/store/ - UI and app state (Zustand stores)
- src/utils/ - Shared helpers and utilities
- app.json, eas.json, expo-env.d.ts - Expo configuration
- drizzle/ - Migration SQL and snapshots
- assets/, docs/ - Static assets and project documents

### **Caching and versioning model**

The finance domain keeps month-keyed caches that only update when their version changes. The key pieces live in:

- Cache state: src/finance/cache/
   - transactionOccurrencesCache: planned + real transactions expanded into monthly occurrences
   - balanceCache: daily balances per month (depends on occurrences + reconciliations)
   - transactionSummariesCache: derived summaries (depends on occurrences)
   - occurrencesAndBalanceCache: combined view for UI convenience
   - cacheUpdateQueueing: queues cache updates to avoid overlapping writes
- Versioning state: src/finance/versioning/
   - transactionOccurrenceVersioning: versions per month for occurrences
   - balanceVersioning: versions per month for balances

How it works:

1) A UI hook (e.g., src/finance/hook/useTransactionOccurrences.ts) ensures the range is tracked via ensureTrackingInRange.
2) A mutation hook (e.g., useAddPlannedTransaction, useUpdateRealTransaction) writes to the DB and immediately bumps the relevant versioning store(s) for affected months.
3) The hook reads versions via getVersionsByMonth and calls queueCacheUpdate(...) to serialize async cache writes.
4) The cache update uses the version map to skip fresh months and only recompute stale months.
5) Derived caches (summaries, occurrences+balances) are rebuilt from the updated base caches after the base caches finish updating by their respective hooks.

### **Important usage notes**

- When you create/update/delete planned or real transactions, or balance reconciliations, you must manually bump versioning so caches invalidate. The following hooks already handle this, so use them for any DB writes related to transactions or reconciliations:
   - Planned transactions: useAddPlannedTransaction, useUpdatePlannedTransaction, useDeletePlannedTransaction
   - Real transactions: useAddRealTransaction, useUpdateRealTransaction, useDeleteRealTransaction
   - Balance reconciliations: useAddBalanceReconciliation
- If you add new mutation paths (new DB writes), mirror the existing hooks: write to DB, then call the relevant on* versioning handlers.
- In finance hooks, always call ensureTrackingInRange before getVersionsByMonth for any month range. If you skip tracking, caches may never be invalidated.
- In finance hooks, always wrap async cache updates with queueCacheUpdate(...) to avoid overlapping cache writes.
- Do not directly read/write caches or versioning from views. Always go through the public hooks in src/finance/hook/ to ensure proper cache invalidation and update queuing.
- Balance cache depends on transaction occurrences. balanceCache ensures occurrence version tracking and refreshes occurrences before calculating balances.


## **🤝 Contributing**

This project has been developed as a part of a university course on several occasions.
The next group from the course may continue development and maintenance.
Please follow the process in our [DEVELOPMENT.md](DEVELOPMENT.md) to ensure a smooth workflow. 

## **📄 License**

Distributed under the MIT License. See LICENSE for more information.
