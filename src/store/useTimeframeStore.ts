import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDays, addMonths, addYears } from 'date-fns';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type LengthOptions = 'days' | 'weeks' | 'months' | 'years';

type TimeframeLength = { length: number; type: LengthOptions };

interface TimeframeState {
	timeframeStartYear: number;
	timeframeStartMonth: number;
	timeframeStartDay: number;
	timeframeLength: TimeframeLength;
	setStartDate: (date: Date) => void;
	setLength: (num: number, option: LengthOptions) => void;
	getCurrentTimeframe: () => Date[];
}

const addLength = (date: Date, timeframe: TimeframeLength) => {
	switch (timeframe.type) {
		case 'days':
			return addDays(date, timeframe.length);
		case 'weeks':
			return addDays(date, timeframe.length * 7);
		case 'months':
			return addMonths(date, timeframe.length);
		case 'years':
			return addYears(date, timeframe.length);
	}
};

const getClosestTimeframe = (
	originalStartDate: Date,
	timeframe: TimeframeLength,
) => {
	let currentTimeframeStart = originalStartDate;
	let currentTimeframeEnd = addLength(currentTimeframeStart, timeframe);
	const currentDate = new Date();

	while (currentDate > currentTimeframeEnd) {
		currentTimeframeStart = currentTimeframeEnd;
		currentTimeframeEnd = addLength(currentTimeframeStart, timeframe);
	}

	return { currentTimeframeStart, currentTimeframeEnd };
};

export const useTimeframeStore = create<TimeframeState>()(
	persist(
		(set, get) => ({
			timeframeStartYear: new Date().getFullYear(),
			timeframeStartMonth: new Date().getMonth(),
			timeframeStartDay: new Date().getDate(),
			timeframeLength: { length: 1, type: 'months' },

			setStartDate: (date: Date) =>
				set({
					timeframeStartYear: date.getFullYear(),
					timeframeStartMonth: date.getMonth(),
					timeframeStartDay: date.getDate(),
				}),

			setLength: (num: number, option: LengthOptions) =>
				set({
					timeframeLength: { length: num, type: option },
				}),

			getCurrentTimeframe: () => {
				const {
					timeframeStartYear,
					timeframeStartMonth,
					timeframeStartDay,
					timeframeLength,
				} = get();

				const { currentTimeframeStart, currentTimeframeEnd } =
					getClosestTimeframe(
						new Date(
							timeframeStartYear,
							timeframeStartMonth,
							timeframeStartDay,
						),
						timeframeLength,
					);

				return [currentTimeframeStart, currentTimeframeEnd];
			},
		}),
		{
			name: 'timeframe-storage',
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
