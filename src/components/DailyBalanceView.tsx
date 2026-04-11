import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons';
import { addMonths, subMonths } from 'date-fns';
import { useState } from 'react';
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
				<Text color="$black" fontSize="$2" fontWeight="600">
					{t('Usable funds timespan')}:{' '}
					{`${formatDate(currentTimeframeStart)} - ${formatDate(currentTimeframeEnd)}`}
				</Text>
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

					{/* --- Render all loaded months in reverse order (latest first) ---*/}
					{occurrencesAndBalances.toReversed().map((month) => (
						<DailyEventList
							transactions={month.transactionOccurrences}
							monthKey={month.monthKey}
							selectedDate={selectedDate}
							formatCurrency={formatCurrency}
							key={month.monthKey}
						/>
					))}

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
