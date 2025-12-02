import useBalanceStore from '@/src/store/useBalanceStore';
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons';
import {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { Button, ScrollView, Text, XStack, YStack } from 'tamagui';
import type { Item } from '../../../src/constants/wizardConfig';
import { LOCALE } from '../constants';
import { formatCurrency } from '../utils/budgetUtils';

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
				.slice(0, futureCount), // Get closest N
			current: currentTxns,
			past: pastTxns.slice(0, pastCount), // Get closest N
			pastTxns: pastTxns,
		};
	}, [transactions, currentDate, futureCount, pastCount]);

	useEffect(() => {
		setFutureCount(futureTxns.length);
		setPastCount(pastTxns.length);
	}, [futureTxns, pastTxns]);

	return (
		<YStack flex={1}>
			<ScrollView
				flex={1}
				contentContainerStyle={{ paddingBottom: 50, paddingTop: 20 }}
				showsVerticalScrollIndicator={false}
			>
				<YStack paddingHorizontal={5}>
					{/* --- Current Day Card (Center Focus) --- */}
					<YStack
						backgroundColor="$primary200"
						borderRadius={20}
						paddingVertical={30}
						paddingHorizontal={20}
						marginVertical={20}
						alignItems="center"
						justifyContent="center"
						gap={15}
						shadowColor="$color.black"
						shadowOffset={{ width: 0, height: 4 }}
						shadowOpacity={0.1}
						shadowRadius={4}
						elevation={4}
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
								fontSize="$body"
								fontWeight="500"
							>
								{'No transactions'}
							</Text>
						)}

						{/* Add Button */}
						<Button
							backgroundColor="$white"
							borderRadius={20}
							paddingHorizontal={30}
							height="$buttons.lg"
							onPress={onAddPress}
							pressStyle={{ backgroundColor: '$primary300' }}
							marginVertical={10}
						>
							<Text
								color="$primary100"
								fontWeight="800"
								fontSize="$buttons.md"
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
					</YStack>
				</YStack>
			</ScrollView>
		</YStack>
	);
}
