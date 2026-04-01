import AsyncStorage from '@react-native-async-storage/async-storage';
import { addMonths } from 'date-fns';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface TimeframeState {
	timeframeEndYear: number;
	timeframeEndMonth: number;
	timeframeEndDay: number;
	setEndDate: (date: Date) => void;
}

export const useTimeframeStore = create<TimeframeState>()(
	persist(
		(set) => ({
			timeframeEndYear: addMonths(new Date(), 1).getFullYear(),
			timeframeEndMonth: addMonths(new Date(), 1).getMonth(),
			timeframeEndDay: addMonths(new Date(), 1).getDay(),
			setEndDate: (date: Date) =>
				set({
					timeframeEndYear: date.getFullYear(),
					timeframeEndMonth: date.getMonth(),
					timeframeEndDay: date.getDate(),
				}),
		}),
		{
			name: 'timeframe-storage',
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
