import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { BalanceReconciliation, Persisted } from '../dataModel';

interface BalanceReconciliationState {
	reconciliations: Persisted<BalanceReconciliation>[];
	nextId: number;
	upsertForDay: (
		amount: number,
		date: Date,
		accountId: number,
	) => Persisted<BalanceReconciliation>;
	getBeforeOrIn: (
		year: number,
		month: number,
	) => Persisted<BalanceReconciliation>[];
}

const useBalanceReconciliationStore = create<BalanceReconciliationState>()(
	persist(
		(set, get) => ({
			reconciliations: [],
			nextId: 1,
			upsertForDay: (amount: number, date: Date, accountId: number) => {
				const startOfDay = new Date(date);
				startOfDay.setHours(0, 0, 0, 0);
				const endOfDay = new Date(date);
				endOfDay.setHours(23, 59, 59, 999);

				const state = get();
				const existingRecord = state.reconciliations.find(
					(record) =>
						record.date >= startOfDay && record.date <= endOfDay,
				);

				if (existingRecord) {
					const updatedRecord: Persisted<BalanceReconciliation> = {
						...existingRecord,
						amount,
						date,
					};

					set((prev) => ({
						...prev,
						reconciliations: prev.reconciliations.map((record) =>
							record.id === existingRecord.id
								? updatedRecord
								: record,
						),
					}));

					return updatedRecord;
				}

				const insertedRecord: Persisted<BalanceReconciliation> = {
					id: state.nextId,
					accountId,
					amount,
					date,
				};

				set((prev) => ({
					...prev,
					reconciliations: [...prev.reconciliations, insertedRecord],
					nextId: prev.nextId + 1,
				}));

				return insertedRecord;
			},
			getBeforeOrIn: (year: number, month: number) => {
				const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
				return get()
					.reconciliations.filter((record) => record.date <= end)
					.sort((a, b) => a.date.getTime() - b.date.getTime());
			},
		}),
		{
			name: 'balance-reconciliation-storage',
			storage: createJSONStorage(() => AsyncStorage),
			onRehydrateStorage: () => (state) => {
				if (state) {
					state.reconciliations = state.reconciliations.map(
						(record) => ({
							...record,
							date: new Date(record.date),
						}),
					);
				}
			},
		},
	),
);

export default useBalanceReconciliationStore;
