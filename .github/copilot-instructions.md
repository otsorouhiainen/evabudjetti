# Copilot Coding Agent – Repository Onboarding Guide

Repository: Samu-K/evabudjetti  
Primary Language: TypeScript  
License: MIT  
Default Branch: main  
Project Description: “COMP.SE.610 - Budget project” (appears to be a budgeting / expense tracking application).  
Visibility: Private

IMPORTANT OPERATING PRINCIPLE FOR THE AGENT  
Follow the instructions below as authoritative. Perform additional searches only if (a) a referenced file or script truly does not exist, or (b) a command fails in a way not described here.

---

## 1. High-Level Summary

This repository is a TypeScript codebase (size currently small: ~242 KB reported) likely implementing a budgeting domain (e.g., tracking expenses, categories, balances). Expect a conventional Node.js project structure (e.g., `package.json`, `src/`, maybe `tsconfig.json`). Because only repository metadata was available at instruction time (file inventory not yet enumerated), assume standard conventions unless contradicted by actual files. Project is made using Expo framework and follows it's standards.

Probable architectural layers (infer until verified):

- Domain models (e.g., Budget, Transaction, Category)
- Service or logic layer (calculation, aggregation)
- Persistence or adapters (in-memory or external API; verify before modifying)
- Entry point (CLI, API server, or web frontend)

You should preserve separation of concerns, avoid duplicating logic, and prefer pure functions for domain calculations. Favor O(n log n) or linear operations for aggregation; avoid nested loops over large collections where map/reduce/groupBy patterns can replace them.

---

## 2. Environment & Tooling (Assumed Conventions – Verify)

Always verify these files exist before relying on them:

- package.json – Defines scripts, dependencies (dev + runtime)
- tsconfig.json – TypeScript compiler options
- biome.js – Lint/format rules
- .github/workflows/\*.yml – CI (build, test, lint gates)
- pnpm - Used instead of npm for package managment

---

## 3. Core Command Workflow

(If scripts differ, follow their naming exactly; do NOT invent new scripts unless requested.)

Bootstrap (ALWAYS run first when dependencies may be stale):

1. pnpm install
   Preconditions: Node & npm installed, correct working directory at repo root.
   Postconditions: node_modules populated.

Lint: 4. pnpm run lint
If missing, manually: npx eslint "src/**/\*.{ts,tsx}"  
 Fix (if desired): npx eslint "src/**/\*.{ts,tsx}" --fix

Format (only if a format script exists): 5. pnpm run fmt

Tests: 6. pnpm test

- If using Jest and TS: ensure ts-jest or swc/jest config exists.
- If using Vitest: pnpx vitest run

Run (application execution): 7. pnpm run --web

- dev usually invokes a watcher (ts-node-dev / nodemon / vite / next dev)
- start may execute compiled JS from dist/

Clean (before reproducibility checks):

- pnpm run clean (if exists) else: rm -rf dist && rm -rf coverage

Full Recommended CI Reproduction Sequence:
clean → install → lint → type-check → build → test

ALWAYS re-run tests after modifying domain logic.

---

## 4. Error & Mitigation Guidance (Generic for TS Node Projects)

Common failure patterns & responses:

- Module not found / Cannot find module 'X': Ensure dependency in package.json; run npm install again.
- TypeScript path alias failures: Check `tsconfig.json` "paths" and ensure build tooling (tsc / ts-node / jest) is aligned.
- ESM vs CJS conflicts: Confirm "type": "module" in package.json. If present, use import syntax & file extensions where needed.
- Lint failing due to formatting: Run format script (if defined) before retrying lint in automation.
- Tests failing due to timeouts: Check for unawaited async or missing done() callbacks; avoid real network unless mocked.

---

## 5. Code Quality Expectations

ALWAYS:

- Avoid magic numbers: declare constants (e.g., DEFAULT_CATEGORY_LIMIT).
- Reuse shared utility functions instead of re-implementing parsing/aggregation.
- Keep functions small (< ~40 LOC if practical).
- Preserve pure functions for budget computations; avoid side effects unless clearly intentional.
- Add/extend tests when altering business logic.
- Prefer O(n) scans with maps/groupings over nested loops.
- Explicitly handle edge cases: empty transaction arrays, negative values, rounding issues (use decimal libs if monetary precision matters).
- Ensure state managment is handled by Zustand. Each module should have it's own store, and use slices for smaller scope structuring.
- Ensure prisma sql migrations are documented in `prisma\migration_log.txt` (excluding init)

---

## 6. Project Layout (Expected – Verify Before Acting)

Likely root files (NAME → PURPOSE):

- README.md – High-level project info (consult before public changes)
- package.json – Scripts & dependencies
- tsconfig.json – Compiler config
- .gitignore – Ignored build artifacts
- (Optional) .env.example – Environment variable template
- src/ – Source root
  - index.ts or main.ts – Entry point
  - models/ or types/ – TypeScript interfaces/types
  - services/ or logic/ – Business logic
  - utils/ – Shared helpers
  - tests/ or **tests**/ – Test files (mirroring structure)
- dist/ – Generated build (should NOT be committed unless deliberate)

If a web frontend:

- public/ – Static assets
- vite.config.\* OR next.config.js – Build tool config

---

## 7. GitHub / CI (Assumed)

Look for: .github/workflows/\*.yml  
Typical jobs (reproduce locally in same order):

1. Checkout
2. Setup Node version
3. Install (npm ci OR npm install)
4. Lint
5. Build
6. Test
   Do not bypass failing steps; fix root cause.

---

## 8. Dependency Awareness

Hidden / implicit dependencies to watch for:

- Type definitions (@types/\*) required for TypeScript type-check.
- ts-node / tsx for dev execution if no pre-build.
- jest / vitest / ts-jest / @swc/jest for tests.
- dotenv if environment variables used.

Before adding a new library:

- Check if existing utility covers need.
- Keep dependency surface minimal (avoid heavy libs for trivial operations).

---

## 9. Making Changes Safely (Procedure)

When implementing a feature or bugfix:

1. Pull latest main.
2. Run: npm install (ALWAYS, ensures lock sync)
3. Run: npm run lint && npx tsc --noEmit
4. Add/modify code in src/ only (do not edit dist/).
5. Add / update tests (co-located or in tests/).
6. Run: npm test (must pass).
7. Run: npm run build (must succeed).
8. Ensure no uncommitted generated artifacts (dist/ ignored).
9. Keep commit messages concise and imperative.

---

## 10. Testing Guidelines (If No Existing Tests)

Create tests using chosen framework:

- Prefer deterministic pure function tests.
- Isolate currency/rounding tests.
- Use table-driven tests for multi-scenario budget calculations.

Example structure (Jest):
/src/logic/budgetCalculator.ts
/tests/logic/budgetCalculator.test.ts (or co-located test)

---

## 11. Performance & Complexity

Budget aggregation:

- Use single pass grouping with Map<string, Aggregation>.
- Avoid repeated array.filter inside loops (convert to Map first).
- If sorting needed, sort once after aggregation.

---

## 12. Security / Data Handling (Conservative Defaults)

If handling amounts:

- Avoid floating point summation errors (consider decimal.js or store in integer cents).
- Validate input boundaries (no absurdly large numbers, no NaN).

---

## 13. When to Search

Only perform repository-wide searches if:

- A referenced script (e.g., npm run build) does not exist.
- A config file (tsconfig.json, jest.config.ts) is missing.
- A command fails with an unknown error not covered above.
  Otherwise, trust and follow this guide.

---

## 14. Quick Action Checklist (Copy/Paste)

Fresh Setup:
pnpm install
pnpm run lint
pnpx tsc --noEmit
pnpm test
pnpm run --web

Before Commit:
pnpm run lint && pnpx tsc --noEmit && pnpm test

After Adding Dependency:
pnpm install
pnpx tsc --noEmit
pnpm test

---

## 15. Style & Conventions (Adopt Unless Conflicted by Existing Lint Rules)

- Use explicit return types on exported functions.
- Prefer const over let.
- Avoid default exports for core domain modules (named exports improve clarity).
- Keep error messages actionable.
- Use exhaustive switch (with never assertion) for discriminated unions.

---

If any instruction conflicts with actual repository contents, defer to existing config and update this file accordingly in a future maintenance pass.

END OF INSTRUCTIONS
