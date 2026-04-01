import AsyncStorage from '@react-native-async-storage/async-storage';
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

const addMonthToDate = (date: Date) => {
	const d = date.getDate();
	date.setMonth(date.getMonth() + 1);

	if (date.getDate() !== d) {
		date.setDate(0);
	}
	return date;
};

export const useTimeframeStore = create<TimeframeState>()(
	persist(
		(set) => {
			const currentDate = new Date();
			const defaultEndDate = addMonthToDate(currentDate);

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
