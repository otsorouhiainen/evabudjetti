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

/**
 * Calculates the currently active timeframe.
 * Currently it returns a future timeframe if the start date is in the future
 * and does not support a clean transition between two timeframes yet.
 *
 * @param originalStartDate The start date that was originally provided by the user
 * @param timeframe The timeframe length
 * @returns Both the start and the end dates of the currently active timeframe
 */
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

/**
 * Store for timeframe. For use outside of settings, only use getCurrentTimeframe.
 * The saved timeframe start date is the one that is originally set in settings
 * and wont show the current timeframes start date.
 */
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

			setLength: (length: number, type: LengthOptions) =>
				set({
					timeframeLength: { length: length, type: type },
				}),

			/**
			 * Function to calculate the current timeframe.
			 *
			 * @returns The start and end dates of the current timeframe
			 */
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
