import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons';
import { addMonths, subMonths } from 'date-fns';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ScrollView, Text, XStack, YStack } from 'tamagui';
import { useOccurrencesAndBalances } from '@/src/finance/hook/useOccurrencesAndBalances';
import { useUsableFunds } from '@/src/finance/hook/useUsableFunds';
import {
	getClosestTimeframe,
	useTimeframeStore,
} from '@/src/store/useTimeframeStore';
import { LOCALE } from '../constants/index';
import type { TransactionOccurrence } from '../dataModel';

import { formatCurrency } from '../utils/budgetUtils';
import DailyEventList from './DailyEventList';
import { MultiPlatformDatePicker } from './MultiPlatformDatePicker';
import StyledCard from './styledCard';

interface DailyBalanceViewProps {
	selectedDate: Date;
	onDateChange: (date: Date) => void;
	onAddPress?: () => void;
	onEditPress?: (txn: TransactionOccurrence) => void;
}

// Helper to format date as "dd.mm.yyyy"
const formatDate = (date: Date) => {
	return new Intl.DateTimeFormat(LOCALE, {}).format(date);
};

export default function DailyBalanceView({
	selectedDate,
	onDateChange,
	onAddPress,
}: DailyBalanceViewProps) {
	const { t } = useTranslation();

	/* 
	Variable to determine how many past and future months are rendered. 
	On first load, render only current month
	*/
	const [futureCount, setFutureCount] = useState(0);
	const [pastCount, setPastCount] = useState(0);

	const selectedDay = selectedDate.getDate();

	const selectedYearStr = String(selectedDate.getFullYear());
	const selectedMonthstr =
		selectedDate.getMonth() < 9
			? String(`0${selectedDate.getMonth() + 1}`)
			: String(selectedDate.getMonth() + 1);

	const selectedMonthKey = `${selectedYearStr}-${selectedMonthstr}`;

	// Fetch occurrences and balances for the months that are rendered
	const dataStartDate = subMonths(selectedDate, pastCount);
	const dataEndDate = addMonths(selectedDate, futureCount);

	const occurrencesAndBalances = useOccurrencesAndBalances(
		dataStartDate.getFullYear(),
		dataStartDate.getMonth(),
		dataEndDate.getFullYear(),
		dataEndDate.getMonth(),
	);

	const getSelectedDayBalance = () => {
		for (const month of occurrencesAndBalances) {
			if (month.monthKey === selectedMonthKey) {
				return month.dailyBalances[selectedDay - 1]?.balance;
			}
		}
	};

	const dayBalance = getSelectedDayBalance();

	/* Get  usable funds for selected day */
	const { timeframeLength } = useTimeframeStore();

	const { currentTimeframeStart, currentTimeframeEnd } = getClosestTimeframe(
		selectedDate,
		timeframeLength,
	);

	const usableFunds = useUsableFunds(
		currentTimeframeStart.getFullYear(),
		currentTimeframeStart.getMonth(),
		currentTimeframeStart.getDate(),
		currentTimeframeEnd.getFullYear(),
		currentTimeframeEnd.getMonth(),
		currentTimeframeEnd.getDate(),
	);

	const handlePrevDay = () => {
		const newDate = new Date(selectedDate);
		newDate.setDate(newDate.getDate() - 1);
		onDateChange(newDate);
	};

	const handleNextDay = () => {
		const newDate = new Date(selectedDate);
		newDate.setDate(newDate.getDate() + 1);
		onDateChange(newDate);
	};

	// --- Data Processing ---
	const { currentDay, futureDays, pastDays } = useMemo(() => {
		const cDateStr = formatDate(selectedDate);

		const transactions: TransactionOccurrence[] = [];
		for (const month of occurrencesAndBalances) {
			for (const txn of month.transactionOccurrences) {
				transactions.push(txn);
			}
		}
		// Normalize dates: ensure each txn.date is a Date object so getTime() is available
		const normalizedTxns: TransactionOccurrence[] = transactions.map(
			(t) => {
				const parsedDate =
					// if already a Date keep it, otherwise create a Date from the value
					t.date instanceof Date
						? t.date
						: new Date(t.date as unknown as string);
				return { ...t, date: parsedDate };
			},
		);

		// Sort all transactions by date descending (Newest first)
		const sorted = [...normalizedTxns].sort(
			(a, b) => b.date.getTime() - a.date.getTime(),
		);

		// Grouping all transactions by date (Newest first)
		const grouped: TransactionOccurrence[][] = [];
		let prevDate = '';
		for (const txn of sorted) {
			const newDate = txn.date.toLocaleDateString();
			if (newDate === prevDate) {
				grouped[grouped.length - 1].push(txn);
			} else {
				grouped.push([txn]);
				prevDate = newDate;
			}
		}

		const futureDays: TransactionOccurrence[][] = [];
		const currentDay: TransactionOccurrence[][] = [];
		const pastDays: TransactionOccurrence[][] = [];

		// Iterate and split based on date comparison
		const nowTime = cDateStr;
		grouped.forEach((t) => {
			const tStr = formatDate(t[0].date);

			if (tStr === nowTime) {
				currentDay.push(t);
			} else if (t[0].date > selectedDate) {
				futureDays.push(t);
			} else {
				pastDays.push(t);
			}
		});

		return {
			futureDays: futureDays,
			currentDay: currentDay,
			pastDays: pastDays,
		};
	}, [selectedDate, occurrencesAndBalances]);

	// On "load more" press, display 1 more past/future month
	const handleFutureLoadMorePress = () => {
		setFutureCount((prev) => prev + 1);
	};
	const handlePastLoadMorePress = () => {
		setPastCount((prev) => prev + 1);
	};

	return (
		<YStack flex={1}>
			{/* --- Current Day Card (Static on top) --- */}
			<StyledCard
				style={{ borderWidth: 2 }}
				paddingVertical="$2"
				paddingHorizontal="$4"
				borderRadius="$1"
				borderColor="$primary100"
				alignItems="center"
				justifyContent="center"
				backgroundColor="$primary300"
				marginBottom="0"
			>
				{/* Date Header with Navigation */}
				<Text fontSize="$3" fontWeight="600">
					{' '}
					{t('Daily situation')}{' '}
				</Text>
				<XStack alignItems="center" justifyContent="center" gap={20}>
					<Button
						outlineColor="$black"
						size="$buttons.md"
						icon={ChevronLeft}
						onPress={handlePrevDay}
						backgroundColor="$transparent"
						circular
						iconAfter={undefined}
					/>

					<MultiPlatformDatePicker
						value={selectedDate}
						color="black"
						onChange={(value) => {
							onDateChange(value);
						}}
					/>

					<Button
						outlineColor="$black"
						size="$buttons.md"
						icon={ChevronRight}
						onPress={handleNextDay}
						backgroundColor="$transparent"
						circular
						iconAfter={undefined}
					/>
				</XStack>

				{/* Daily Stats */}
				<XStack>
					<YStack alignItems="center" paddingRight={10}>
						<Text color="$black" fontSize="$body" fontWeight="600">
							{t('Account balance')}:
						</Text>
						<Text color="$black" fontSize="$4" fontWeight="800">
							{dayBalance !== undefined
								? formatCurrency(dayBalance)
								: t('Unknown')}
						</Text>
					</YStack>
					<YStack alignItems="center" paddingLeft={10}>
						<Text color="$black" fontSize="$body" fontWeight="600">
							{t('Usable funds')}:
						</Text>
						<Text color="$black" fontSize="$4" fontWeight="800">
							{dayBalance !== undefined
								? `${formatCurrency(usableFunds)} ${t('/ day')}`
								: '--'}
						</Text>
					</YStack>
				</XStack>

				{/* Add Button */}
				<Button
					backgroundColor="$primary100"
					borderRadius="$4"
					paddingHorizontal="$6"
					paddingVertical="$2"
					height="wrap-content"
					onPress={onAddPress}
					pressStyle={{ backgroundColor: '$primary200' }}
					marginVertical={10}
				>
					<Text
						color="$white"
						fontWeight="500"
						fontSize="$3"
						numberOfLines={1}
						adjustsFontSizeToFit
					>
						{t('ADD INCOME/EXPENSE')}
					</Text>
				</Button>
			</StyledCard>

			<ScrollView
				flex={1}
				contentContainerStyle={{ paddingBottom: 50, paddingTop: 10 }}
				showsVerticalScrollIndicator={false}
			>
				<YStack paddingHorizontal="$1">
					{/* --- Future Load More button --- */}
					<YStack alignItems="center" marginBottom={'$2'}>
						<Text
							color="$primary100"
							fontSize="$body"
							onPress={handleFutureLoadMorePress}
							pressStyle={{ color: '$primary300' }}
							cursor={'pointer'}
						>
							{t('Load more')}
						</Text>
					</YStack>

					{/* --- Future Events --- */}
					<DailyEventList
						txnsByDate={futureDays}
						title={''}
						selectedDate={selectedDate}
						isCurrent={false}
						formatCurrency={formatCurrency}
					/>
					{/* --- Present day events --- */}
					<DailyEventList
						txnsByDate={currentDay}
						title={''}
						selectedDate={selectedDate}
						isCurrent={true}
						formatCurrency={formatCurrency}
					/>
					{/* --- Past Events --- */}
					<DailyEventList
						txnsByDate={pastDays}
						title={''}
						selectedDate={selectedDate}
						isCurrent={false}
						formatCurrency={formatCurrency}
					/>

					{/* --- Past Load More button --- */}
					<YStack alignItems="center" marginTop="$2">
						<Text
							color="$primary100"
							fontSize="$body"
							onPress={handlePastLoadMorePress}
							pressStyle={{ color: '$primary300' }}
							cursor={'pointer'}
						>
							{t('Load more')}
						</Text>
					</YStack>
				</YStack>
			</ScrollView>
		</YStack>
	);
}
