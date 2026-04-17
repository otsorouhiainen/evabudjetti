import { create } from 'zustand';
import type { Persisted, PlannedTransaction } from '@/src/dataModel';

interface PlannedTransactionVersioningState {
	version: number;
	onPlannedTransactionCreated: (txn: Persisted<PlannedTransaction>) => void;
	onPlannedTransactionUpdated: (
		old: Persisted<PlannedTransaction>,
		updated: Persisted<PlannedTransaction>,
	) => void;
	onPlannedTransactionDeleted: (txn: Persisted<PlannedTransaction>) => void;
}

export const usePlannedTransactionVersioning =
	create<PlannedTransactionVersioningState>()((set) => ({
		version: 0,
		onPlannedTransactionCreated: () =>
			set((s) => ({ version: s.version + 1 })),
		onPlannedTransactionUpdated: () =>
			set((s) => ({ version: s.version + 1 })),
		onPlannedTransactionDeleted: () =>
			set((s) => ({ version: s.version + 1 })),
	}));
