import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
} from '@tamagui/lucide-icons';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ScrollView, Text, XStack, YStack } from 'tamagui';
import useBalanceStore from '@/src/store/useBalanceStore';
import { LOCALE } from '../constants/index';
import type { TransactionOccurrence } from '../dataModel';
import { formatCurrency } from '../utils/budgetUtils';
import BudgetEventList from './BudgetEventList';
import { MultiPlatformDatePicker } from './MultiPlatformDatePicker';
import StyledCard from './styledCard';

interface BudgetDayViewProps {
	currentDate: Date;
	transactions: TransactionOccurrence[];
	onDateChange: (date: Date) => void;
	onAddPress?: () => void;
	onEditPress?: (txn: TransactionOccurrence) => void;
}

// Helper to format date as "dd.mm.yyyy"
const formatDate = (date: Date) => {
	return new Intl.DateTimeFormat(LOCALE, {}).format(date);
};

export default function BudgetDayView({
	currentDate,
	transactions,
	onDateChange,
	onAddPress,
}: BudgetDayViewProps) {
	const { t } = useTranslation();
	// State to track how many transactions to show
	const storeBalance = useBalanceStore((state) => state.balance);
	const storeDisposable = useBalanceStore((state) => state.disposable);
	// When first rendered, show only 3 future txs
	const [futureCount, setFutureCount] = useState(3);
	// When first rendered, show only 4 past txs
	const [pastCount, setPastCount] = useState(4);
	const [currentBalance, setCurrentBalance] = useState(0);
	const [disposable, setDisposable] = useState(0);

	useEffect(() => {
		setCurrentBalance(storeBalance);
		setDisposable(storeDisposable);
	}, [storeBalance, storeDisposable]);

	const handlePrevDay = () => {
		const newDate = new Date(currentDate);
		newDate.setDate(newDate.getDate() - 1);
		onDateChange(newDate);
	};

	const handleNextDay = () => {
		const newDate = new Date(currentDate);
		newDate.setDate(newDate.getDate() + 1);
		onDateChange(newDate);
	};

	// --- Data Processing ---
	const { past, current, future, futureTxns, pastTxns } = useMemo(() => {
		const cDateStr = formatDate(currentDate);

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

		const futureTxns: TransactionOccurrence[] = [];
		const currentTxns: TransactionOccurrence[] = [];
		const pastTxns: TransactionOccurrence[] = [];

		// Iterate and split based on date comparison
		const nowTime = currentDate.getTime();

		sorted.forEach((t) => {
			const tStr = formatDate(t.date);

			if (tStr === cDateStr) {
				currentTxns.push(t);
			} else if (t.date.getTime() > nowTime) {
				futureTxns.push(t);
			} else {
				pastTxns.push(t);
			}
		});

		// Future events: We want the ones CLOSEST to today
		return {
			futureTxns: futureTxns,
			future: futureTxns
				.slice(
					Math.max(0, futureTxns.length - futureCount),
					futureTxns.length,
				)
				.slice(0, futureCount),
			current: currentTxns,
			past: pastTxns.slice(0, pastCount),
			pastTxns: pastTxns,
		};
	}, [transactions, currentDate, futureCount, pastCount]);

	// Display 2 more transactions per chevron click

	const handleUpChevronClick = () => {
		if (futureTxns.length > futureCount) {
			setFutureCount((prev) => prev + 2);
		}
	};
	const handleDownChevronClick = () => {
		if (pastTxns.length > pastCount) {
			setPastCount((prev) => prev + 2);
		}
	};

	return (
		<YStack flex={1}>
			{/* --- Current Day Card (Static on top) --- */}
			<StyledCard
				paddingVertical="$2"
				paddingHorizontal="$4"
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
						outlineColor="$white"
						size="$buttons.md"
						icon={ChevronLeft}
						onPress={handlePrevDay}
						backgroundColor="$transparent"
						circular
						iconAfter={undefined}
					/>

					<MultiPlatformDatePicker
						value={currentDate}
						color="black"
						onChange={(value) => {
							onDateChange(value);
						}}
					/>

					<Button
						outlineColor="$white"
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
							{t('Disposable income')}:
						</Text>
						<Text color="$black" fontSize="$4" fontWeight="800">
							{formatCurrency(disposable)}
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
						<Button
							unstyled
							onPress={handleUpChevronClick}
							opacity={futureTxns.length > futureCount ? 1 : 0.3}
							disabled={futureTxns.length <= futureCount}
							cursor={
								futureTxns.length > futureCount
									? 'pointer'
									: 'default'
							}
						>
							<ChevronUp
								size={'$buttons.md'}
								color="$color.black"
							/>
						</Button>
					</YStack>

					{/* --- Future Events --- */}
					<BudgetEventList
						txns={future}
						title={''}
						formatCurrency={formatCurrency}
					/>
					{/* --- Present day events --- */}
					<BudgetEventList
						txns={current}
						title={''}
						formatCurrency={formatCurrency}
					/>
					{/* --- Past Events --- */}
					<BudgetEventList
						txns={past}
						title={''}
						formatCurrency={formatCurrency}
					/>

					{/* --- Navigation / Down Chevron --- */}
					<YStack alignItems="center" marginTop="$2">
						<Button
							unstyled
							onPress={handleDownChevronClick}
							opacity={pastTxns.length > pastCount ? 1 : 0.3}
							disabled={pastTxns.length <= pastCount}
							cursor={
								pastTxns.length > pastCount
									? 'pointer'
									: 'default'
							}
						>
							<ChevronDown
								size={'$buttons.md'}
								color="$color.black"
							/>
						</Button>
					</YStack>
				</YStack>
			</ScrollView>
		</YStack>
	);
}
