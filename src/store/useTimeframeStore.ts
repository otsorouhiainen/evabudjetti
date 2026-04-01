import AsyncStorage from '@react-native-async-storage/async-storage';
import { addMonths } from 'date-fns';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface TimeframeState {
	startDate: Date;
	endDate: Date;
	setStartDate: (date: Date) => void;
	setEndDate: (date: Date) => void;
}

export const useTimeframeStore = create<TimeframeState>()(
	persist(
		(set) => ({
			startDate: new Date(),
			endDate: addMonths(new Date(), 1),
			setStartDate: (date: Date) =>
				set({
					startDate: date,
				}),
			setEndDate: (date: Date) =>
				set({
					endDate: date,
				}),
		}),
		{
			name: 'timeframe-storage',
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
