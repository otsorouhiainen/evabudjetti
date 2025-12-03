import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from '@tamagui/lucide-icons';
import {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { Button, ScrollView, Text, XStack, YStack } from 'tamagui';
import useBalanceStore from '@/src/store/useBalanceStore';
import type { Item } from '../../../src/constants/wizardConfig';
import { LOCALE } from '../constants';
import { formatCurrency } from '../utils/budgetUtils';
import StyledCard from './styledCard';
import BudgetEventList from './BudgetEventList';

interface BudgetDayViewProps {
	currentDate: Date;
	transactions: Item[];
	onDateChange: (date: Date) => void;
	onAddPress?: () => void;
	onEditPress?: (txn: Item) => void;
	setEditVisible: (state: boolean) => void;
	setEditingTxn: (txn: Item) => void;
	setInputDate: Dispatch<SetStateAction<string>>;
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
	setInputDate,
	setEditingTxn,
	setEditVisible,
}: BudgetDayViewProps) {
	// State to track how many transactions to show
	const storeBalance = useBalanceStore((state) => state.balance);
	const storeDisposable = useBalanceStore((state) => state.disposable);
	const [futureCount, setFutureCount] = useState(0);
	const [pastCount, setPastCount] = useState(0);
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
		const normalizedTxns: Item[] = transactions.map((t) => {
			const parsedDate =
				// if already a Date keep it, otherwise create a Date from the value
				t.date instanceof Date
					? t.date
					: new Date(t.date as unknown as string);
			return { ...t, date: parsedDate };
		});

		// Sort all transactions by date descending (Newest first)
		const sorted = [...normalizedTxns].sort(
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

	useEffect(() => {
		setFutureCount(futureTxns.length);
		setPastCount(pastTxns.length);
	}, [futureTxns, pastTxns]);

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
						formatCurrency={formatCurrency}
					/>

					{/* --- Current Day Card (Center Focus) --- */}
					<StyledCard
						paddingVertical="$2"
						paddingHorizontal="$4"
						marginVertical="$4"
						alignItems="center"
						justifyContent="center"
					>					
						{/* Date Header with Navigation */}
						<XStack
							alignItems="center"
							justifyContent="center"
							gap={15}
						>
							<Button
								outlineColor="$white"
								size="$buttons.md"
								icon={ChevronLeft}
								onPress={handlePrevDay}
								backgroundColor="$transparent"
								circular
								iconAfter={undefined}
							/>
							<Text
								color="$white"
								fontSize="$title1"
								fontWeight="700"
							>
								{formatDate(currentDate)}
							</Text>
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

						{/* Transactions or Empty State */}
						{current.length > 0 ? (
							<YStack width="100%" gap={10}>
								{current.map((t) => (
									<XStack
										key={t.id}
										justifyContent="space-between"
										borderBottomWidth={1}
										borderColor="$primary300"
										pb={10}
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
								{'No transactions'}
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
							marginVertical={10}
						>
							<Text
								color="$primary100"
								fontWeight="800"
								fontSize="$buttons.sm"
								textTransform="uppercase"
							>
								{'Add new'}
							</Text>
						</Button>

						{/* Daily Stats */}
						<YStack alignItems="center" gap={5}>
							<Text color="$white" fontSize="$body">
								{'Account balance'}:{' '}
								{formatCurrency(currentBalance)}
							</Text>
							<Text color="$white" fontSize="$body">
								{'Disposable income'}:{' '}
								{formatCurrency(disposable)}
							</Text>
						</YStack>
					</StyledCard>

					{/* --- Past Events --- */}
					<BudgetEventList
						txns={past}
						title={""}
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
							<ChevronDown size={"$buttons.md"} color="$color.black" />
						</Button>
					</YStack>
				</YStack>
			</ScrollView>
		</YStack>
	);
}
