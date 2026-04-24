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
	getCurrentTimeframe: (date: Date) => Date;
}

const addLength = (date: Date, timeframe: TimeframeLength) => {
	let endDate = date;
	switch (timeframe.type) {
		case 'days':
			endDate = addDays(date, timeframe.length);
			break;
		case 'weeks':
			endDate = addDays(date, timeframe.length * 7);
			break;
		case 'months':
			endDate = addMonths(date, timeframe.length);
			break;
		case 'years':
			endDate = addYears(date, timeframe.length);
	}
	// remove next timeframes first day from current timeframe
	endDate = addDays(endDate, -1);

	return endDate;
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
			 * @param date The date for which the current timeframe needs to be calculated
			 * @returns The end date of the current timeframe.
			 */
			getCurrentTimeframe: (date: Date) => {
				const {
					timeframeStartYear,
					timeframeStartMonth,
					timeframeStartDay,
					timeframeLength,
				} = get();

				// skip calculations if timeframe is 1 day
				if (
					timeframeLength.type === 'days' &&
					timeframeLength.length === 1
				) {
					return date;
				}

				let currentTimeframeStart = new Date(
					timeframeStartYear,
					timeframeStartMonth,
					timeframeStartDay,
				);
				let currentTimeframeEnd = addLength(
					currentTimeframeStart,
					timeframeLength,
				);

				while (date > addDays(currentTimeframeEnd, 1)) {
					// increment next timeframe start to current end + 1 for new start
					currentTimeframeStart = addDays(currentTimeframeEnd, 1);
					currentTimeframeEnd = addLength(
						currentTimeframeStart,
						timeframeLength,
					);
				}

				return currentTimeframeEnd;
			},
		}),
		{
			name: 'timeframe-storage',
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
