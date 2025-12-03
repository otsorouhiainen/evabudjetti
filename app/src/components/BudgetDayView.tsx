import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import i18next from 'i18next';
import { type Dispatch, type SetStateAction, useMemo, useState } from 'react';
import { Button, ScrollView, Text, XStack, YStack } from 'tamagui';
import BudgetEventList from '@/app/src/components/BudgetEventList';
import type { Item } from '../../../src/constants/wizardConfig';
import { LOCALE } from '../constants';
import { formatCurrency } from '../utils/budgetUtils';
import StyledCard from './styledCard';

interface BudgetDayViewProps {
	currentDate: Date;
	transactions: Item[];
	onAddPress?: () => void;
	onEditPress?: (txn: Item) => void;
	setEditVisible: (state: boolean) => void;
	setEditingTxn: (txn: Item) => void;
	setInputDate: Dispatch<SetStateAction<string>>;
}

// Helper to format date as "dd.mm.yyyy"
const formatDate = (date: Date) => {
	return new Intl.DateTimeFormat(LOCALE, {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	}).format(date);
};

export default function BudgetDayView({
	currentDate,
	transactions,
	onAddPress,
	setInputDate,
	setEditingTxn,
	setEditVisible,
}: BudgetDayViewProps) {
	// State to track how many transactions to show
	const [futureCount, setFutureCount] = useState(3);
	const [pastCount, setPastCount] = useState(4);

	// --- Data Processing ---
	const { past, current, future, futureTxns, pastTxns } = useMemo(() => {
		const cDateStr = formatDate(currentDate);

		// Sort all transactions by date descending (Newest first)
		const sorted = [...transactions].sort(
			(a, b) => b.date.getTime() - a.date.getTime(),
		);

		const futureTxns: Item[] = [];
		const currentTxns: Item[] = [];
		const pastTxns: Item[] = [];

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

		// Future events: We want the ones CLOSEST to the future.
		// The sorted array is Descending (Aug 3, Aug 2, Aug 1).

		return {
			futureTxns: futureTxns,
			future: futureTxns
				.slice(
					Math.max(0, futureTxns.length - futureCount),
					futureTxns.length,
				)
				.reverse()
				.slice(0, futureCount),
			current: currentTxns,
			past: pastTxns.slice(0, pastCount),
			pastTxns: pastTxns,
		};
	}, [transactions, currentDate, futureCount, pastCount]);

	// Handlers for chevron clicks
	const handleUpChevronClick = () => {
		if (futureTxns.length > futureCount) {
			setFutureCount((prev) => Math.min(prev + 3, futureTxns.length));
		}
	};

	const handleDownChevronClick = () => {
		if (pastTxns.length > pastCount) {
			setPastCount((prev) => Math.min(prev + 3, pastTxns.length));
		}
	};

	// Mock Totals for the center card (In a real app, calculate these based on history)
	const currentBalance = 200.0;
	const disposable = 6.0;

	return (
		<YStack flex={1}>
			<ScrollView
				flex={1}
				contentContainerStyle={{ paddingBottom: 50, paddingTop: 10 }}
				showsVerticalScrollIndicator={false}
			>
				<YStack paddingHorizontal="$1">
					{/* --- Navigation / Up Chevron --- */}
					<YStack alignItems="center" marginBottom={"$2"}>
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
							<ChevronUp size={"$buttons.md"} color="$color.black" />
						</Button>
					</YStack>

					{/* --- Future Events --- */}
					<BudgetEventList
						txns={future}
						title={""}
						setInputDate={setInputDate}
						formatCurrency={formatCurrency}
						setEditVisible={setEditVisible}
						setEditingTxn={setEditingTxn}
					/>

					{/* --- Current Day Card (Center Focus) --- */}
					<StyledCard
						paddingVertical="$2"
						paddingHorizontal="$4"
						marginVertical="$4"
						alignItems="center"
						justifyContent="center"
					>
						{/* Date Header */}
						<Text
							color="$white"
							fontSize="$5"
							fontWeight="700"							
						>
							{formatDate(currentDate)}
						</Text>

						{/* Transactions or Empty State */}
						{current.length > 0 ? (
							<YStack width="100%" gap="$2">
								{current.map((t) => (
									<XStack
										key={t.id}
										justifyContent="space-between"
										borderBottomWidth={1}
										borderColor="$primary300"
										pb="$2"
									>
										<Text color="$white">{t.name}</Text>
										<Text color="$white">
											{formatCurrency(Number(t.amount))}
										</Text>
									</XStack>
								))}
							</YStack>
						) : (
							<Text
								color="$white"
								fontSize="$3"
								fontWeight="500"
								fontStyle='italic'
								marginTop={"$4"}
							>
								{i18next.t('No transactions')}
							</Text>
						)}

						{/* Add Button */}
						<Button
							backgroundColor="$white"
							borderRadius="$4"
							paddingHorizontal="$6"
							height='wrap-content'
							onPress={onAddPress}
							pressStyle={{ backgroundColor: '$primary300' }}
							marginVertical="$2"
						>
							<Text
								color="$primary100"
								fontWeight="800"
								fontSize="$buttons.sm"
								textTransform="uppercase"
							>
								{i18next.t('Add new')}
							</Text>
						</Button>

						{/* Daily Stats */}
						<YStack alignItems="center" gap="$1">
							<Text color="$white" fontSize="$body">
								{i18next.t('Account balance')}:{' '}
								{formatCurrency(currentBalance)}
							</Text>
							<Text color="$white" fontSize="$body">
								{i18next.t('Disposable income')}:{' '}
								{formatCurrency(disposable)}
							</Text>
						</YStack>
					</StyledCard>

					{/* --- Past Events --- */}
					<BudgetEventList
						txns={past}
						title={""}
						setInputDate={setInputDate}
						formatCurrency={formatCurrency}
						setEditVisible={setEditVisible}
						setEditingTxn={setEditingTxn}
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
							<ChevronDown size={"$buttons.md"} color="$color.black" />
						</Button>
					</YStack>
				</YStack>
			</ScrollView>
		</YStack>
	);
}
