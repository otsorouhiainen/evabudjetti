import useBalanceStore from '@/src/store/useBalanceStore';
import { ChevronLeft, ChevronRight, HelpCircle } from '@tamagui/lucide-icons';
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
	const storeBalance = useBalanceStore((state) => state.balance);
	const storeDisposable = useBalanceStore((state) => state.disposable);
	const [currentBalance, setCurrentBalance] = useState(0);
	const [disposable, setDisposable] = useState(0);
	const [incomesOpen, setIncomesOpen] = useState(true);
	const [expensesOpen, setExpensesOpen] = useState(true);
	const [helpVisible, setHelpVisible] = useState(false);

	const today = new Date();

	const { past, future } = useMemo(
		() => splitTransactions(transactions, currentDate),
		[transactions, currentDate],
	);

	const POSITIVE_TX: Item[] = [...future, ...past].filter(
		(ex) => ex.type === 'income',
	);

	const NEGATIVE_TX: Item[] = [...future, ...past].filter(
		(ex) => ex.type === 'expense',
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

	useEffect(() => {
		setCurrentBalance(storeBalance);
		setDisposable(storeDisposable);
	}, [storeBalance, storeDisposable]);

	return (
		<YStack flex={1}>
			<ScrollView
				paddingTop={15}
				paddingHorizontal={5}
				contentContainerStyle={{ paddingBottom: 100 }}
				scrollEnabled={!editOpen}
				showsVerticalScrollIndicator={false}
			>
				{/* Month selector */}
				<YStack marginBottom={10}>
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
					name={'Incomes'}
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
					name={'Expenses'}
					setEditVisible={setEditVisible}
					setEditingTxn={setEditingTxn}
					setInputDate={setInputDate}
					openDropdown={setExpensesOpen}
					isOpen={expensesOpen}
					formatCurrency={formatCurrency}
				/>

				{/* Snapshot */}
				<YStack marginBottom={15}>
					<Text fontSize={'$body'} fontWeight={'700'}>
						{today.toLocaleDateString(LOCALE)}
					</Text>
					<Text>
						{'Balance'}:
						<Text fontSize={'$body'}>
							{' '}
							{formatCurrency(currentBalance)}
						</Text>
					</Text>
					<XStack>
						<Text>
							{'Disposable income'}:
							<Text fontSize={'$body'}>
								{' '}
								{formatCurrency(disposable)}
							</Text>
						</Text>
						<Button
							outlineColor={'$black'}
							onPress={() => setHelpVisible(true)}
							icon={HelpCircle}
							width={10}
						/>
					</XStack>
				</YStack>

				{/* Future events */}
				<BudgetEventList
					txns={future}
					title={'Future events'}
					setEditVisible={setEditVisible}
					setEditingTxn={setEditingTxn}
					setInputDate={setInputDate}
					formatCurrency={formatCurrency}
				/>

				{/* Past events */}
				<BudgetEventList
					txns={past}
					title={'Past events'}
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
						borderRadius={10}
						padding={15}
						width="90%"
						maxWidth="$popupMaxWidth"
						shadowColor="$color.black"
						shadowOffset={{ width: 0, height: 3 }}
						shadowOpacity={0.25}
						shadowRadius={3}
						elevation={3}
					>
						<Text fontSize={20} mb={10}>
							{'Instructions'}
						</Text>
						<Text mb={10}>{'Help Disposable income'}</Text>
						<Button
							onPress={() => setHelpVisible(false)}
							backgroundColor={'$primary200'}
							size={'$buttons.lg'}
							width={'50%'}
						>
							<Text color={'$white'}>{'Close'}</Text>
						</Button>
					</YStack>
				</YStack>
			)}
		</YStack>
	);
}
