import { ChevronLeft, ChevronRight, Pencil, X } from '@tamagui/lucide-icons';
import { useCallback, useMemo, useState } from 'react';
import { Button, ScrollView, Separator, Text, XStack, YStack } from 'tamagui';
import BudgetDropdown from '@/app/src/components/BudgetDropdown';
import type {
	Item,
	Recurrence,
	TransactionType,
} from '../../../src/constants/wizardConfig';
import { formatCurrency } from '../utils/budgetUtils';

interface BudgetYearViewProps {
	currentDate: Date;
	transactions: Item[];
	onDateChange: (date: Date) => void;
}

// Finnish short month names for the grid
const MONTH_NAMES_SHORT = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
];

// Full names for the header
const MONTH_NAMES_FULL = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

export default function BudgetYearView({
	currentDate,
	transactions,
	onDateChange,
}: BudgetYearViewProps) {
	const [incomesOpen, setIncomesOpen] = useState(false);
	const [expensesOpen, setExpensesOpen] = useState(false);
	const [selectedMonthIndex, setSelectedMonthIndex] = useState<number | null>(
		null,
	);

	const handlePrev = () => {
		const newDate = new Date(currentDate);
		newDate.setFullYear(newDate.getFullYear() - 1);
		onDateChange(newDate);
	};

	const handleNext = () => {
		const newDate = new Date(currentDate);
		newDate.setFullYear(newDate.getFullYear() + 1);
		onDateChange(newDate);
	};

	const yearLabel = currentDate.getFullYear();
	// 1. Filter transactions to only have the currently selected year
	const yearTransactions = useMemo(() => {
		return transactions.filter((t) => {
			const parsedDate =
				t.date instanceof Date ? t.date : new Date(t.date as string);
			return parsedDate.getFullYear() === currentDate.getFullYear();
		});
	}, [transactions, currentDate]);

	// 2. Arrange transactions by Category for the Dropdowns
	const { incomeCategories, expenseCategories } = useMemo(() => {
		const incomeMap: Record<string, number> = {};
		const expenseMap: Record<string, number> = {};

		yearTransactions.forEach((t) => {
			const amount = Number(t.amount);
			// Use the category string, or fallback if empty
			const category = t.category || 'Uncategorized';

			if (amount >= 0) {
				incomeMap[category] = (incomeMap[category] || 0) + amount;
			} else {
				expenseMap[category] = (expenseMap[category] || 0) + amount;
			}
		});

		// Helper to convert the Map back into a Item object shape so BudgetDropdown accepts it
		const mapToTxns = (map: Record<string, number>): Item[] => {
			return (
				Object.entries(map)
					.map(([catName, totalAmount], index) => ({
						id: index.toString(),
						name: catName,
						amount: totalAmount,
						date: currentDate,
						category: catName,
						type: 'income' as TransactionType,
						recurrence: 'none' as Recurrence,
					}))
					// This sorts the result highest value-first
					.sort(
						(a, b) =>
							Math.abs(b.amount as number) -
							Math.abs(a.amount as number),
					)
			);
		};

		return {
			incomeCategories: mapToTxns(incomeMap),
			expenseCategories: mapToTxns(expenseMap),
		};
	}, [yearTransactions, currentDate]);

	// Helper to get data for a specific month index (0-11) for the month grid
	const getMonthData = useCallback(
		(monthIndex: number) => {
			const monthTxns = yearTransactions.filter((t) => {
				const parsedDate =
					t.date instanceof Date
						? t.date
						: new Date(t.date as string);
				return parsedDate.getMonth() === monthIndex;
			});

			let income = 0;
			let expenses = 0;

			monthTxns.forEach((t) => {
				const val = Number(t.amount);
				if (t.type === 'income') income += val;
				else expenses += val;
			});
			return {
				income,
				expenses,
				balance: income - expenses,
				txns: monthTxns,
			};
		},
		[yearTransactions],
	);

	// overlay thay shows when a grid card is clicked
	const renderMonthDetailOverlay = () => {
		if (selectedMonthIndex === null) return null;

		const data = getMonthData(selectedMonthIndex);
		const incomeTxns = data.txns.filter((t) => t.type === 'income');
		const expenseTxns = data.txns.filter((t) => t.type === 'expense');
		return (
			<YStack
				position="absolute"
				top={0}
				left={0}
				right={0}
				bottom={0}
				zIndex={100}
				justifyContent="center"
				backgroundColor="rgba(0,0,0,0.5)"
				alignItems="center"
			>
				<YStack
					width="95%"
					backgroundColor="$color.white"
					borderWidth={2}
					borderColor="$primary200"
					borderRadius={10}
					padding={20}
					shadowColor="$color.black"
					shadowRadius={10}
					shadowOpacity={0.1}
					elevation={5}
				>
					{/* Header */}
					<XStack
						justifyContent="space-between"
						alignItems="center"
						marginBottom={20}
					>
						<XStack alignItems="center" gap={10}>
							<Text fontSize="$title2" fontWeight="800">
								{MONTH_NAMES_FULL[selectedMonthIndex]}
							</Text>
							<Pencil size={16} color="$color.black" />
						</XStack>
						<Button
							size="$buttons.sm"
							circular
							backgroundColor="transparent"
							icon={X}
							onPress={() => setSelectedMonthIndex(null)}
						/>
					</XStack>

					<ScrollView maxHeight={400}>
						{/* Incomes */}
						<XStack
							justifyContent="space-between"
							marginBottom={10}
						>
							<Text fontWeight="700" fontSize="$body">
								{'Incomes'}
							</Text>
							<Text fontWeight="700" fontSize="$body">
								{formatCurrency(data.income)}
							</Text>
						</XStack>

						<YStack marginBottom={20}>
							{incomeTxns.length > 0 ? (
								incomeTxns.map((t) => (
									<XStack
										key={t.id}
										justifyContent="space-between"
										marginBottom={5}
									>
										<Text
											fontSize={15}
											color="$color.disabled"
										>
											{t.name}
										</Text>
										<Text fontSize={15}>
											{formatCurrency(Number(t.amount))}
										</Text>
									</XStack>
								))
							) : (
								<Text fontSize={10} color="$color.disabled">
									{'No income records'}
								</Text>
							)}
						</YStack>

						{/* Expenses */}
						<XStack
							justifyContent="space-between"
							marginBottom={10}
						>
							<Text fontWeight="700" fontSize="$body">
								{'Expenses'}
							</Text>
							<Text fontWeight="700" fontSize="$body">
								{formatCurrency(Math.abs(data.expenses))}
							</Text>
						</XStack>

						<YStack marginBottom={20}>
							{expenseTxns.length > 0 ? (
								expenseTxns.map((t) => (
									<XStack
										key={t.id}
										justifyContent="space-between"
										marginBottom={5}
									>
										<Text
											fontSize={15}
											color="$color.disabled"
										>
											{t.name}
										</Text>
										<Text fontSize={15}>
											{formatCurrency(
												Math.abs(Number(t.amount)),
											)}
										</Text>
									</XStack>
								))
							) : (
								<Text fontSize={10} color="$color.disabled">
									{'No expense records'}
								</Text>
							)}
						</YStack>

						<Separator
							marginVertical={10}
							borderColor="$color.disabled"
						/>

						{/* Total */}
						<XStack justifyContent="space-between" marginTop={10}>
							<Text fontWeight="800" fontSize="$body">
								{'Total'}
							</Text>
							<Text fontWeight="800" fontSize="$body">
								{data.balance > 0 ? '+' : ''}{' '}
								{formatCurrency(data.balance)}
							</Text>
						</XStack>
					</ScrollView>
				</YStack>
			</YStack>
		);
	};
	return (
		<YStack flex={1}>
			<ScrollView
				contentContainerStyle={{ paddingBottom: 50 }}
				showsVerticalScrollIndicator={false}
				paddingTop={15}
				paddingHorizontal={5}
			>
				{/* year selector */}
				<YStack marginBottom={10}>
					<XStack ai="center" jc="space-between" width={180}>
						<Button
							outlineColor={'$black'}
							size="$buttons.md"
							icon={ChevronLeft}
							onPress={() => handlePrev()}
							backgroundColor="$transparent"
							circular
						/>
						<Text fontSize={'$body'} fontWeight={'6'}>
							{yearLabel}
						</Text>
						<Button
							outlineColor={'$black'}
							size={'$buttons.sm'}
							icon={ChevronRight}
							onPress={() => handleNext()}
							backgroundColor="$transparent"
							circular
						/>
					</XStack>
				</YStack>

				<BudgetDropdown
					name={'Incomes'}
					txns={incomeCategories}
					isOpen={incomesOpen}
					openDropdown={setIncomesOpen}
					formatCurrency={formatCurrency}
				/>

				<BudgetDropdown
					name={'Expenses'}
					txns={expenseCategories}
					isOpen={expensesOpen}
					openDropdown={setExpensesOpen}
					formatCurrency={formatCurrency}
				/>

				{/* Months Grid */}
				<Text marginBottom={10} fontSize="$body">
					{'Months'}
				</Text>
				<XStack flexWrap="wrap" gap={10} justifyContent="space-between">
					{Array.from({ length: 12 }).map((_, index) => {
						const data = getMonthData(index);
						// Logic for color: If balance is negative (Expenses > Income), use caution color
						// Otherwise use Primary color
						const cardKey = index;
						const isAlert = data.balance < 0;
						const isCurrentMonth =
							currentDate.getFullYear() ===
								new Date().getFullYear() &&
							index === new Date().getMonth();

						return (
							<Button
								key={cardKey}
								width="31%" // Fits 3 items roughly with gap
								height={50}
								backgroundColor={
									isAlert ? '$caution' : '$primary200'
								}
								borderRadius={10}
								onPress={() => setSelectedMonthIndex(index)}
								pressStyle={{ opacity: 0.8 }}
								borderWidth={isCurrentMonth ? 2 : 0}
								borderColor="$color.black"
							>
								<Text
									color={
										isAlert ? '$color.primary100' : '$white'
									}
									fontWeight="600"
								>
									{MONTH_NAMES_SHORT[index]}{' '}
									{isAlert ? '!' : ''}
								</Text>
							</Button>
						);
					})}
				</XStack>
			</ScrollView>

			{/* Detail Modal */}
			{renderMonthDetailOverlay()}
		</YStack>
	);
}
