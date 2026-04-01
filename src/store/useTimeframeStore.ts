import AsyncStorage from '@react-native-async-storage/async-storage';
import { addMonths } from 'date-fns';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface TimeframeState {
	startYear: number;
	startMonth: number;
	startDay: number;
	endYear: number;
	endMonth: number;
	endDay: number;
	setTimeframe: (startDate: Date, endDate: Date) => void;
}

export const useTimeframeStore = create<TimeframeState>()(
	persist(
		(set) => {
			const currentDate = new Date();
			const defaultEndDate = addMonths(currentDate, 1);

			return {
				// Oletusarvo: kuukauden jakso alkaen nykyisestä hetkestä
				startYear: currentDate.getFullYear(),
				startMonth: currentDate.getFullYear(),
				startDay: currentDate.getDay(),
				endYear: defaultEndDate.getFullYear(),
				endMonth: defaultEndDate.getMonth(),
				endDay: defaultEndDate.getDay(),

				// Funktio jakson muuttamiseen
				setTimeframe: (startDate: Date, endDate: Date) =>
					set({
						startYear: startDate.getFullYear(),
						startMonth: startDate.getMonth(),
						startDay: startDate.getDay(),
						endYear: endDate.getFullYear(),
						endMonth: endDate.getMonth(),
						endDay: endDate.getDay(),
					}),
			};
		},
		{
			name: 'timeframe-storage',
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
