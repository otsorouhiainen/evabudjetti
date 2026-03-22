import { db } from '@/src/db/client';
import * as schema from '@/src/db/schema';
import { DEFAULT_ACCOUNT_ID } from '@/src/dataModel';

export async function insertBalanceReconciliation(amount: number, date: Date = new Date()) {
    const [insertedReconciliation] = await db
        .insert(schema.balanceReconciliations)
        .values({
            accountId: DEFAULT_ACCOUNT_ID,
            amount: amount,
            date: date,
        })
        .returning();

    return insertedReconciliation;
}