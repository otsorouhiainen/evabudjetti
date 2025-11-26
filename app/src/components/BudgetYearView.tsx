import { ChevronLeft, ChevronRight, Pencil, X } from '@tamagui/lucide-icons';
import i18next from 'i18next';
import { useCallback, useMemo, useState } from 'react';
import { Button, ScrollView, Separator, Text, XStack, YStack } from 'tamagui';
import BudgetDropdown from '@/app/src/components/BudgetDropdown';
import type {
	Item,
	Reoccurence,
	TransactionType,
} from '../../../src/constants/wizardConfig';
import { formatCurrency } from '../utils/budgetUtils';

interface BudgetYearViewProps {
	ReceivedCurrentDate: Date;
	transactions: Item[];
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
	ReceivedCurrentDate,
	transactions,
}: BudgetYearViewProps) {
	const [currentDate, setcurrentDate] = useState(ReceivedCurrentDate);
	const [incomesOpen, setIncomesOpen] = useState(false);
	const [expensesOpen, setExpensesOpen] = useState(false);
	const [selectedMonthIndex, setSelectedMonthIndex] = useState<number | null>(
		null,
	);

	const handlePrev = () => {
		const newDate = new Date(currentDate);
		newDate.setFullYear(newDate.getFullYear() - 1);
		setcurrentDate(newDate);
	};

	const handleNext = () => {
		const newDate = new Date(currentDate);
		newDate.setFullYear(newDate.getFullYear() + 1);
		setcurrentDate(newDate);
	};

	const yearLabel = currentDate.getFullYear();

	// 1. Filter transactions to only have the currently selected year
	const yearTransactions = useMemo(() => {
		return transactions.filter(
			(t) => t.date.getFullYear() === currentDate.getFullYear(),
		);
	}, [transactions, currentDate]);

	// 2. Arrange transactions by Category for the Dropdowns
	const { incomeCategories, expenseCategories } = useMemo(() => {
		const incomeMap: Record<string, number> = {};
		const expenseMap: Record<string, number> = {};

		yearTransactions.forEach((t) => {
			const amount = Number(t.amount);
			// Use the category string, or fallback if empty
			const category = t.category || i18next.t('Uncategorized');

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
						id: index,
						name: catName, // <--- This sets the Title in the dropdown to the Category Name
						amount: totalAmount,
						date: currentDate, // Dummy date
						category: catName,
						type: 'income' as TransactionType,
						reoccurence: 'none' as Reoccurence,
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
			const monthTxns = yearTransactions.filter(
				(t) => t.date.getMonth() === monthIndex,
			);

			let income = 0;
			let expenses = 0;

			monthTxns.forEach((t) => {
				const val = Number(t.amount);
				if (val >= 0) income += val;
				else expenses += val;
			});

			return {
				income,
				expenses,
				balance: income + expenses,
				txns: monthTxns,
			};
		},
		[yearTransactions],
	);

	// overlay thay shows when a grid card is clicked
	const renderMonthDetailOverlay = () => {
		if (selectedMonthIndex === null) return null;

		const data = getMonthData(selectedMonthIndex);
		const incomeTxns = data.txns.filter((t) => Number(t.amount) >= 0);
		const expenseTxns = data.txns.filter((t) => Number(t.amount) < 0);
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
					borderRadius="$2"
					padding="$4"
					shadowColor="$color.black"
					shadowRadius={10}
					shadowOpacity={0.1}
					elevation={5}
				>
					{/* Header */}
					<XStack
						justifyContent="space-between"
						alignItems="center"
						marginBottom="$4"
					>
						<XStack alignItems="center" gap="$2">
							<Text fontSize="$title2" fontWeight="800">
								{i18next.t(
									MONTH_NAMES_FULL[selectedMonthIndex],
								)}
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
							marginBottom="$2"
						>
							<Text fontWeight="700" fontSize="$body">
								{i18next.t('Incomes')}
							</Text>
							<Text fontWeight="700" fontSize="$body">
								{formatCurrency(data.income)}
							</Text>
						</XStack>

						<YStack marginBottom="$4">
							{incomeTxns.length > 0 ? (
								incomeTxns.map((t) => (
									<XStack
										key={t.id}
										justifyContent="space-between"
										marginBottom="$1"
									>
										<Text
											fontSize="$3"
											color="$color.disabled"
										>
											{t.name}
										</Text>
										<Text fontSize="$3">
											{formatCurrency(Number(t.amount))}
										</Text>
									</XStack>
								))
							) : (
								<Text fontSize="$2" color="$color.disabled">
									{i18next.t('No income records')}
								</Text>
							)}
						</YStack>

						{/* Expenses */}
						<XStack
							justifyContent="space-between"
							marginBottom="$2"
						>
							<Text fontWeight="700" fontSize="$body">
								{i18next.t('Expenses')}
							</Text>
							<Text fontWeight="700" fontSize="$body">
								{formatCurrency(Math.abs(data.expenses))}
							</Text>
						</XStack>

						<YStack marginBottom="$4">
							{expenseTxns.length > 0 ? (
								expenseTxns.map((t) => (
									<XStack
										key={t.id}
										justifyContent="space-between"
										marginBottom="$1"
									>
										<Text
											fontSize="$3"
											color="$color.disabled"
										>
											{t.name}
										</Text>
										<Text fontSize="$3">
											{formatCurrency(
												Math.abs(Number(t.amount)),
											)}
										</Text>
									</XStack>
								))
							) : (
								<Text fontSize="$2" color="$color.disabled">
									{i18next.t('No expense records')}
								</Text>
							)}
						</YStack>

						<Separator
							marginVertical="$2"
							borderColor="$color.disabled"
						/>

						{/* Total */}
						<XStack justifyContent="space-between" marginTop="$2">
							<Text fontWeight="800" fontSize="$body">
								{i18next.t('Total')}
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
				paddingTop={'$3'}
				paddingHorizontal={'$1'}
			>
				{/* year selector */}
				<YStack marginBottom={'$2'}>
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
					name={i18next.t('Incomes')}
					txns={incomeCategories}
					isOpen={incomesOpen}
					openDropdown={setIncomesOpen}
					formatCurrency={formatCurrency}
				/>

				<BudgetDropdown
					name={i18next.t('Expenses')}
					txns={expenseCategories}
					isOpen={expensesOpen}
					openDropdown={setExpensesOpen}
					formatCurrency={formatCurrency}
				/>

				{/* Months Grid */}
				<Text marginBottom="$2" fontSize="$body">
					{i18next.t('Months')}
				</Text>
				<XStack flexWrap="wrap" gap="$2" justifyContent="space-between">
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
								borderRadius="$2"
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
									{i18next.t(MONTH_NAMES_SHORT[index])}{' '}
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
