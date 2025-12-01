import BudgetEventList from '@/app/src/components/BudgetEventList';
import useBalanceStore from '@/src/store/useBalanceStore';
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import i18next from 'i18next';
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

	// --- Data Processing ---
	const { past, current, future, futureTxns, pastTxns } = useMemo(() => {
		const cDateStr = formatDate(currentDate);
		console.log('ype', transactions);

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

	return (
		<YStack flex={1}>
			<ScrollView
				flex={1}
				contentContainerStyle={{ paddingBottom: 50, paddingTop: 20 }}
				showsVerticalScrollIndicator={false}
			>
				<YStack paddingHorizontal="$1">
					{/* --- Navigation / Up Chevron --- */}
					<YStack alignItems="center" marginBottom="$2">
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
							<ChevronUp size={24} color="$color.black" />
						</Button>
					</YStack>

					{/* --- Future Events --- */}
					<BudgetEventList
						txns={future}
						title={i18next.t('{{count}} upcoming events', {
							count: futureCount,
						})}
						setInputDate={setInputDate}
						formatCurrency={formatCurrency}
						setEditVisible={setEditVisible}
						setEditingTxn={setEditingTxn}
					/>

					{/* --- Current Day Card (Center Focus) --- */}
					<YStack
						backgroundColor="$primary200"
						borderRadius="$4"
						paddingVertical="$6"
						paddingHorizontal="$4"
						marginVertical="$4"
						alignItems="center"
						justifyContent="center"
						gap="$3"
						shadowColor="$color.black"
						shadowOffset={{ width: 0, height: 4 }}
						shadowOpacity={0.1}
						shadowRadius={4}
						elevation={4}
					>
						{/* Date Header */}
						<Text
							color="$white"
							fontSize="$title1"
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
								fontSize="$body"
								fontWeight="500"
							>
								{i18next.t('No transactions')}
							</Text>
						)}

						{/* Add Button */}
						<Button
							backgroundColor="$white"
							borderRadius="$4"
							paddingHorizontal="$6"
							height="$buttons.lg"
							onPress={onAddPress}
							pressStyle={{ backgroundColor: '$primary300' }}
							marginVertical="$2"
						>
							<Text
								color="$primary100"
								fontWeight="800"
								fontSize="$buttons.md"
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
					</YStack>

					{/* --- Past Events --- */}
					<BudgetEventList
						txns={past}
						title={i18next.t('{{count}} past events', {
							count: pastCount,
						})}
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
							<ChevronDown size={24} color="$color.black" />
						</Button>
					</YStack>
				</YStack>
			</ScrollView>
		</YStack>
	);
}
