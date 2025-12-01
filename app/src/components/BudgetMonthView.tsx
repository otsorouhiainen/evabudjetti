import { ChevronLeft, ChevronRight, HelpCircle } from '@tamagui/lucide-icons';
import i18next from 'i18next';
import { type Dispatch, type SetStateAction, useMemo, useState } from 'react';
import { Button, ScrollView, Text, XStack, YStack } from 'tamagui';
import type { Item } from '../../../src/constants/wizardConfig';
import { LOCALE } from '../constants';
import { formatCurrency, splitTransactions } from '../utils/budgetUtils';
import BudgetDropdown from './BudgetDropdown';
import BudgetEventList from './BudgetEventList';

interface BudgetMonthViewProps {
	currentDate: Date;
	transactions: Item[];
	onDateChange: (date: Date) => void;
	setEditVisible: (visible: boolean) => void;
	setEditingTxn: (txn: Item) => void;
	setInputDate: Dispatch<SetStateAction<string>>;
	editOpen: boolean;
}

export default function BudgetMonthView({
	currentDate,
	transactions,
	onDateChange,
	setEditVisible,
	setEditingTxn,
	setInputDate,
	editOpen,
}: BudgetMonthViewProps) {
	const [incomesOpen, setIncomesOpen] = useState(true);
	const [expensesOpen, setExpensesOpen] = useState(true);
	const [helpVisible, setHelpVisible] = useState(false);

	const today = new Date();

	const { past, future } = useMemo(
		() => splitTransactions(transactions, currentDate),
		[transactions, currentDate],
	);

	const POSITIVE_TX: Item[] = [...future, ...past].filter(
		(ex) => Number(ex.amount) >= 0,
	);

	const NEGATIVE_TX: Item[] = [...future, ...past].filter(
		(ex) => Number(ex.amount) < 0,
	);

	const monthLabel = new Intl.DateTimeFormat(LOCALE, {
		month: 'long',
		year: 'numeric',
	}).format(currentDate);

	const handlePrev = () => {
		const newDate = new Date(currentDate);
		newDate.setMonth(newDate.getMonth() - 1);
		onDateChange(newDate);
	};

	const handleNext = () => {
		const newDate = new Date(currentDate);
		newDate.setMonth(newDate.getMonth() + 1);
		onDateChange(newDate);
	};

	// Calculate totals based on current month transactions
	const totals = useMemo(() => {
		let income = 0;
		let expenses = 0;

		[...future, ...past].forEach((txn) => {
			const amount = Number(txn.amount);
			if (amount > 0) income += amount;
			else expenses += Math.abs(amount);
		});

		return {
			balance: income - expenses,
			discretionary: Math.max(0, income - expenses), // Simplified calculation
		};
	}, [future, past]);

	return (
		<YStack flex={1}>
			<ScrollView
				paddingTop={'$3'}
				paddingHorizontal={'$1'}
				contentContainerStyle={{ paddingBottom: 100 }}
				scrollEnabled={!editOpen}
				showsVerticalScrollIndicator={false}
			>
				{/* Month selector */}
				<YStack marginBottom={'$2'}>
					<XStack ai="center" jc="space-between" width={180}>
						<Button
							outlineColor={'$black'}
							size="$buttons.md"
							icon={ChevronLeft}
							onPress={handlePrev}
							backgroundColor="$transparent"
							circular
						/>
						<Text fontSize={'$body'} fontWeight={'6'}>
							{monthLabel}
						</Text>
						<Button
							outlineColor={'$black'}
							size={'$buttons.sm'}
							icon={ChevronRight}
							onPress={handleNext}
							backgroundColor="$transparent"
							circular
						/>
					</XStack>
				</YStack>

				{/* Income dropdown */}
				<BudgetDropdown
					txns={POSITIVE_TX}
					name={i18next.t('Incomes')}
					setEditVisible={setEditVisible}
					setEditingTxn={setEditingTxn}
					setInputDate={setInputDate}
					openDropdown={setIncomesOpen}
					isOpen={incomesOpen}
					formatCurrency={formatCurrency}
				/>

				{/* Expense dropdown */}
				<BudgetDropdown
					txns={NEGATIVE_TX}
					name={i18next.t('Expenses')}
					setEditVisible={setEditVisible}
					setEditingTxn={setEditingTxn}
					setInputDate={setInputDate}
					openDropdown={setExpensesOpen}
					isOpen={expensesOpen}
					formatCurrency={formatCurrency}
				/>

				{/* Snapshot */}
				<YStack marginBottom={'$3'}>
					<Text fontSize={'$body'} fontWeight={'700'}>
						{today.toLocaleDateString(LOCALE)}
					</Text>
					<Text>
						{i18next.t('Balance')}:
						<Text fontSize={'$body'}>
							{' '}
							{formatCurrency(totals.balance)}
						</Text>
					</Text>
					<XStack>
						<Text>
							{i18next.t('Disposable income')}:
							<Text fontSize={'$body'}>
								{' '}
								{formatCurrency(totals.discretionary)}
							</Text>
						</Text>
						<Button
							outlineColor={'$black'}
							onPress={() => setHelpVisible(true)}
							icon={HelpCircle}
							width={'$2'}
						/>
					</XStack>
				</YStack>

				{/* Future events */}
				<BudgetEventList
					txns={future}
					title={i18next.t('Future events')}
					setEditVisible={setEditVisible}
					setEditingTxn={setEditingTxn}
					setInputDate={setInputDate}
					formatCurrency={formatCurrency}
				/>

				{/* Past events */}
				<BudgetEventList
					txns={past}
					title={i18next.t('Past events')}
					setEditVisible={setEditVisible}
					setEditingTxn={setEditingTxn}
					setInputDate={setInputDate}
					formatCurrency={formatCurrency}
				/>
			</ScrollView>
			{/* Help Modal */}
			{helpVisible && (
				<YStack
					position="absolute"
					top={0}
					left={0}
					right={0}
					bottom={0}
					justifyContent="center"
					alignItems="center"
					zIndex={'$zIndex.1'}
				>
					<YStack
						backgroundColor="$color.white"
						borderRadius="$2"
						padding="$3"
						width="90%"
						maxWidth="$popupMaxWidth"
						shadowColor="$color.black"
						shadowOffset={{ width: 0, height: 3 }}
						shadowOpacity={0.25}
						shadowRadius={3}
						elevation={3}
					>
						<Text fontSize={'$4'} mb={'$2'}>
							{i18next.t('Instructions')}
						</Text>
						<Text mb={'$2'}>
							{i18next.t('Help Disposable income')}
						</Text>
						<Button
							onPress={() => setHelpVisible(false)}
							backgroundColor={'$primary200'}
							size={'$buttons.lg'}
							width={'50%'}
						>
							<Text color={'$white'}>{i18next.t('Close')}</Text>
						</Button>
					</YStack>
				</YStack>
			)}
		</YStack>
	);
}
