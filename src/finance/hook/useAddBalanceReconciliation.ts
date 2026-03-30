import { useCallback } from 'react';
import { insertBalanceReconciliation } from '../query/balanceReconciliationMutations';
import { useBalanceVersioning } from '../versioning/balanceVersioning';

export function useAddBalanceReconciliation() {
	// Grab the versioning bump
	const onBalanceReconciliationCreated = useBalanceVersioning(
		(state) => state.onBalanceReconciliationCreated,
	);

	const setInitialBalance = useCallback(
		async (amount: number) => {
			const newReconciliation = await insertBalanceReconciliation(amount);

			onBalanceReconciliationCreated(newReconciliation);
		},
		[onBalanceReconciliationCreated],
	);

	return setInitialBalance;
}
