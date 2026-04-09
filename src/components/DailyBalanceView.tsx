import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ScrollView, Text, XStack, YStack } from 'tamagui';
import { useUsableFunds } from '@/src/finance/hook/useUsableFunds';
import useBalanceStore from '@/src/store/useBalanceStore';
import { useTimeframeStore } from '@/src/store/useTimeframeStore';
import { LOCALE } from '../constants/index';
import type { TransactionOccurrence } from '../dataModel';
import { formatCurrency } from '../utils/budgetUtils';
import DailyEventList from './DailyEventList';
import { MultiPlatformDatePicker } from './MultiPlatformDatePicker';
import StyledCard from './styledCard';

interface DailyBalanceViewProps {
	selectedDate: Date;
	transactions: TransactionOccurrence[];
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
	transactions,
	onDateChange,
	onAddPress,
}: DailyBalanceViewProps) {
	const { t } = useTranslation();
	// State to track how many transactions to show
	const storeBalance = useBalanceStore((state) => state.balance);
	// When first rendered, show 30 future days
	const [futureCount, setFutureCount] = useState(30);
	// When first rendered, show 30 past days
	const [pastCount, setPastCount] = useState(30);
	const [currentBalance, setCurrentBalance] = useState(0);

	const { getCurrentTimeframe } = useTimeframeStore();

	const [timeframeStart, timeframeEnd] = getCurrentTimeframe();

	const usableFunds = useUsableFunds(
		timeframeStart.getFullYear(),
		timeframeStart.getMonth(),
		timeframeStart.getDate(),
		timeframeEnd.getFullYear(),
		timeframeEnd.getMonth(),
		timeframeEnd.getDate(),
	);

	useEffect(() => {
		setCurrentBalance(storeBalance);
	}, [storeBalance]);

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
	const { past, current, future, futureDays, pastDays } = useMemo(() => {
		const cDateStr = formatDate(selectedDate);

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

		// Future events: We want the ones CLOSEST to today
		return {
			futureDays: futureDays,
			future: futureDays
				.slice(
					Math.max(0, futureDays.length - futureCount),
					futureDays.length,
				)
				.slice(0, futureCount),
			current: currentDay,
			past: pastDays.slice(0, pastCount),
			pastDays: pastDays,
		};
	}, [transactions, selectedDate, futureCount, pastCount]);

	// Display 10 more days on "load more" press

	const handleFutureLoadMorePress = () => {
		if (futureDays.length > futureCount) {
			setFutureCount((prev) => prev + 10);
		}
	};
	const handlePastLoadMorePress = () => {
		if (pastDays.length > pastCount) {
			setPastCount((prev) => prev + 10);
		}
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
							{formatCurrency(currentBalance)}
						</Text>
					</YStack>
					<YStack alignItems="center" paddingLeft={10}>
						<Text color="$black" fontSize="$body" fontWeight="600">
							{t('Usable funds')}:
						</Text>
						<Text color="$black" fontSize="$4" fontWeight="800">
							{formatCurrency(usableFunds)} {t('/ day')}
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
					{/* --- Navigation / Up Chevron --- */}
					<YStack alignItems="center" marginBottom={'$2'}>
						<Text
							color="$primary100"
							fontSize="$body"
							onPress={handleFutureLoadMorePress}
							pressStyle={{ color: '$primary300' }}
							opacity={futureDays.length > futureCount ? 1 : 0.3}
							disabled={futureDays.length <= futureCount}
							cursor={
								futureDays.length > futureCount
									? 'pointer'
									: 'default'
							}
						>
							{t('Load more')}
						</Text>
					</YStack>

					{/* --- Future Events --- */}
					<DailyEventList
						txnsByDate={future}
						title={''}
						isCurrent={false}
						formatCurrency={formatCurrency}
					/>
					{/* --- Present day events --- */}
					<DailyEventList
						txnsByDate={current}
						title={''}
						isCurrent={true}
						formatCurrency={formatCurrency}
					/>
					{/* --- Past Events --- */}
					<DailyEventList
						txnsByDate={past}
						title={''}
						isCurrent={false}
						formatCurrency={formatCurrency}
					/>

					{/* --- Navigation / Down Chevron --- */}
					<YStack alignItems="center" marginTop="$2">
						<Text
							color="$primary100"
							fontSize="$body"
							onPress={handlePastLoadMorePress}
							pressStyle={{ color: '$primary300' }}
							opacity={pastDays.length > pastCount ? 1 : 0.3}
							disabled={pastDays.length <= pastCount}
							cursor={
								pastDays.length > pastCount
									? 'pointer'
									: 'default'
							}
						>
							{t('Load more')}
						</Text>
					</YStack>
				</YStack>
			</ScrollView>
		</YStack>
	);
}
