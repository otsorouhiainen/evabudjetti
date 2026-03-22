import { useCallback } from 'react';
import { insertBalanceReconciliation } from '../query/balanceReconciliationMutations';
import { useBalanceVersioning } from '../versioning/balanceVersioning';

export function useSetInitialBalance() {
    // Grab the versioning bump 
    const onBalanceReconciliationCreated = useBalanceVersioning(
        (state) => state.onBalanceReconciliationCreated
    );

    const setInitialBalance = useCallback(async (amount: number) => {
        // Save to database
        const newReconciliation = await insertBalanceReconciliation(amount);
        
        // Tell versioning system to invalidate cache
        onBalanceReconciliationCreated(newReconciliation);
    }, [onBalanceReconciliationCreated]);

    return setInitialBalance;
}