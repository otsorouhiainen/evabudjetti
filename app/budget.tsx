import { BudgetDropdown } from '@/src/components/BudgetDropdown';
import { BudgetEventList } from '@/src/components/BudgetEventList';
import { ChevronLeft, ChevronRight, HelpCircle } from '@tamagui/lucide-icons';
import { useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, ScrollView, Tabs, Text, XStack, YStack } from 'tamagui';
import type { Item } from '../src/constants/wizardConfig';
import useBalanceStore from '../src/store/useBalanceStore';
import usePlannedTransactionsStore from '../src/store/usePlannedTransactionsStore';
import { StyledTab } from './src/components/StyledTab';
import { LOCALE } from './src/constants/';

// Possibly removed later if declared for whole project
const today = new Date(Date.now());

function parseTxnDate(dateStr: string): Date {
	// "dd.mm.yyyy" → Date
	const [day, month, year] = dateStr.split('.').map(Number);
	return new Date(year, month - 1, day);
}

function splitTransactions(transactions: Item[], referenceDate: Date = today) {
	const normalizedDate = new Date(referenceDate);
	normalizedDate.setHours(0, 0, 0, 0);

	const past: Item[] = [];
	const future: Item[] = [];

	for (const tx of transactions) {
		const txDate = tx.date;
		if (txDate < today) {
			past.push(tx);
		} else {
			future.push(tx);
		}
	}

	return { past, future };
}

function formatCurrency(value: number, hideSign?: boolean) {
	// Formats given currency to a locale (currently finnish)
	// hidesign: hides minus sign on negative numbers if true.
	return Intl.NumberFormat('fi-FI', {
		style: 'currency',
		currency: 'EUR',
		signDisplay: hideSign ? 'never' : 'auto',
		unitDisplay: 'narrow',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(value);
}

export default function Budget() {
	const storeTransactions = usePlannedTransactionsStore(
		(state) => state.transactions,
	);
	const storeBalance = useBalanceStore((state) => state.balance);
	const storeDisposable = useBalanceStore((state) => state.disposable);
	const [incomesOpen, setIncomesOpen] = useState(true);
	const [expensesOpen, setExpensesOpen] = useState(true);
	const [helpVisible, setHelpVisible] = useState(false);
	const [editOpen, setEditVisible] = useState(false);
	const [editingTxn, setEditingTxn] = useState<Item | null>(null);
	const [currentDate, setcurrentDate] = useState(new Date());
	const [transactions, setTransactions] = useState<Item[]>([
		{
			id: 0,
			name: '',
			amount: 0,
			date: new Date(),
			type: 'income',
			category: 'uncategorized',
			reoccurence: 'none',
		},
	]);
	const [selectedTab, setSelectedTab] = useState('day');
	const [error, setError] = useState('');
	const [dateInput, setDateInput] = useState('');
	const [totals, setTotals] = useState({
		balance: 1,
		discretionary: 1,
	});
	const { past, future } = useMemo(
		() => splitTransactions(transactions),
		[transactions],
	);
	useEffect(() => {
		setTransactions(storeTransactions.map((tx) => tx));
	}, [storeTransactions]);
	const POSITIVE_TX: Item[] = [...future, ...past].filter(
		(ex) => ex.type === 'income',
	);
	useEffect(() => {
		setTotals({
			balance: storeBalance,
			discretionary: storeDisposable,
		});
	}, [storeBalance, storeDisposable]);

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
		setcurrentDate(newDate);
	};

	const handleNext = () => {
		const newDate = new Date(currentDate);
		newDate.setMonth(newDate.getMonth() + 1);
		setcurrentDate(newDate);
	};

	const handleSave = () => {
		if (!editingTxn) return;
		setTransactions((prev) =>
			prev.map((tx) => (tx.id === editingTxn.id ? editingTxn : tx)),
		);
		setEditVisible(false);
		setEditingTxn(null);
	};

	const isValidDate = (text: string) => {
		// Regex for dd.mm.yyyy
		const regex = /^(\d{2})[./](\d{2})[./](\d{4})$/;
		const match = regex.exec(text);

		if (!match) return false;

		const day = parseInt(match[1], 10);
		const month = parseInt(match[2], 10) - 1;
		const year = parseInt(match[3], 10);

		const date = new Date(year, month, day);

		// Check that JS didn’t autocorrect invalid dates (like 32.01.2025 → 01.02.2025)
		return (
			date.getFullYear() === year &&
			date.getMonth() === month &&
			date.getDate() === day
		);
	};

	const handleDateChange = (text: string) => {
		setDateInput(text);

		if (text === '') {
			setError('');
			return; // don’t touch txn.date
		}

		if (isValidDate(text)) {
			setError('');
			const newDate = parseTxnDate(text);
			setEditingTxn((prev) => (prev ? { ...prev, date: newDate } : prev));
		} else {
			setError('Invalid date, use format: dd.mm.yyyy');
			// leave txn.date as-is
		}
	};

	const handleAmountChange = (text: string) => {
		setEditingTxn((prev) => {
			if (!prev) return prev;

			// Allow empty string or just "-" without forcing a number
			if (text === '' || text === '-') {
				return prev; // Keep previous value, don't update amount field
			}

			const num = Number(text);
			return Number.isFinite(num) ? { ...prev, amount: num } : prev;
		});
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<YStack
				backgroundColor={'$color.white'}
				paddingTop={'$paddingmd'}
				paddingHorizontal={'$paddingmd'}
				flex={1}
			>
				<Tabs
					value={selectedTab}
					onValueChange={setSelectedTab}
					backgroundColor="transparent"
					f={1}
					flexDirection="column"
				>
					<Tabs.List
						flexDirection="row"
						height={'$tabItemHeight'}
						backgroundColor="transparent"
					>
						<StyledTab
							value="day"
							flex={1} // You can conditionally set this
							borderTopLeftRadius={20}
							borderBottomLeftRadius={20}
						>
							<Text
								color={
									selectedTab === 'day'
										? '$color.white'
										: '$color.black'
								}
							>
								Day
							</Text>
						</StyledTab>
						<StyledTab value="month" flex={1} borderRadius={0}>
							<Text
								padding={'$2'}
								color={
									selectedTab === 'month'
										? '$color.white'
										: '$color.black'
								}
							>
								Month
							</Text>
						</StyledTab>
						<StyledTab
							value="year"
							flex={1}
							borderTopRightRadius={20}
							borderBottomRightRadius={20}
						>
							<Text
								padding={10}
								color={
									selectedTab === 'year'
										? '$color.white'
										: '$color.black'
								}
								borderRadius={15}
							>
								Year
							</Text>
						</StyledTab>
					</Tabs.List>
					<Tabs.Content value="month">
						<ScrollView
							paddingTop={'$3'}
							paddingHorizontal={'$3'}
							nestedScrollEnabled={true}
							contentContainerStyle={{ paddingBottom: 100 }}
							bounces
							scrollEventThrottle={16}
							scrollEnabled={!editOpen}
						>
							{/* month selector */}
							<YStack marginBottom={'$2'}>
								<XStack
									ai="center"
									jc="space-between"
									width={180}
								>
									<Button
										outlineColor={'$black'}
										size="$buttons.md"
										icon={ChevronLeft}
										onPress={() => handlePrev()}
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
										onPress={() => handleNext()}
										backgroundColor="$transparent"
										circular
									/>
								</XStack>
							</YStack>
							<BudgetDropdown
								txns={POSITIVE_TX}
								name={'Incomes'}
								setEditVisible={setEditVisible}
								setEditingTxn={setEditingTxn}
								setInputDate={setDateInput}
								openDropdown={setIncomesOpen}
								isOpen={incomesOpen}
								formatCurrency={formatCurrency}
							/>

							<BudgetDropdown
								txns={NEGATIVE_TX}
								name={'Expenses'}
								setEditVisible={setEditVisible}
								setEditingTxn={setEditingTxn}
								setInputDate={setDateInput}
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
									Balance:
									<Text fontSize={'$body'}>
										{formatCurrency(totals.balance)}
									</Text>
								</Text>
								<XStack>
									<Text>
										Disposable income:
										<Text fontSize={'$body'}>
											{formatCurrency(
												totals.discretionary,
											)}
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
											Instructions
										</Text>
										<Text mb={'$2'}>
											Disposable income refers to the
											amount of money that remains after
											income and expenses. It helps you
											understand how much money you have
											available for other expenses or
											savings during the month
										</Text>
										<Button
											onPress={() =>
												setHelpVisible(false)
											}
											backgroundColor={'$primary200'}
											size={'$buttons.lg'}
											width={'50%'}
										>
											<Text color={'$white'}>CLOSE</Text>
										</Button>
									</YStack>
								</YStack>
							)}
							<BudgetEventList
								txns={future}
								title={'Future events'}
								setEditVisible={setEditVisible}
								setEditingTxn={setEditingTxn}
								setInputDate={setDateInput}
								formatCurrency={formatCurrency}
							/>
							<BudgetEventList
								txns={past}
								title={'Past events'}
								setEditVisible={setEditVisible}
								setEditingTxn={setEditingTxn}
								setInputDate={setDateInput}
								formatCurrency={formatCurrency}
							/>
						</ScrollView>
					</Tabs.Content>
					<Tabs.Content value="day">
						<ScrollView>
							<Text>Day goes here</Text>
						</ScrollView>
					</Tabs.Content>
					<Tabs.Content value="year">
						<ScrollView>
							<Text>Year goes here</Text>
						</ScrollView>
					</Tabs.Content>
				</Tabs>
			</YStack>
			{/* Edit modal*/}
			{editOpen && (
				<YStack
					position="absolute"
					top={0}
					left={0}
					right={0}
					bottom={0}
					backgroundColor="rgba(0,0,0,0.3)"
					justifyContent="center"
					alignItems="center"
					zIndex={'$zIndex.1'}
				>
					<YStack
						bottom={150}
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
						<Text>Edit Transaction</Text>
						<Input
							height={40}
							maxLength={25}
							borderRadius={'$2'}
							px={'$2'}
							value={editingTxn?.name}
							marginVertical={'$2'}
							onChangeText={(text) =>
								setEditingTxn((prev) =>
									prev
										? {
												...prev,
												name: text,
											}
										: prev,
								)
							}
						/>
						{editingTxn?.amount === 0 && (
							<Text
								color="$color.danger500"
								fontSize="$2"
								marginTop="$1"
							>
								Amount must be greater than zero
							</Text>
						)}

						<Input
							height={40}
							px={'$2'}
							keyboardType="numeric"
							maxLength={9}
							borderRadius={'$2'}
							value={String(editingTxn?.amount || '')}
							onChangeText={handleAmountChange}
							borderColor={
								editingTxn?.amount === 0
									? '$color.danger500'
									: '$color.black'
							}
							marginVertical={'$2'}
						/>
						{!editingTxn?.name && (
							<Text
								color="$color.danger500"
								fontSize="$2"
								marginTop="$1"
							>
								Name is required
							</Text>
						)}

						<Input
							height={40}
							px={'$2'}
							value={dateInput}
							maxLength={10}
							borderRadius={'$2'}
							onChangeText={handleDateChange}
							borderColor={
								error ? '$color.danger500' : '$color.black'
							}
							marginVertical={'$2'}
						/>
						{error && (
							<Text
								color="$color.danger500"
								fontSize="$2"
								marginTop="$1"
							>
								Invalid date format
							</Text>
						)}
						<XStack gap={'$3'}>
							<Button
								onPress={() => handleSave()}
								disabled={
									error !== '' || editingTxn?.amount === 0
								}
								backgroundColor={'$color.primary200'}
								size={'$buttons.md'}
								borderRadius={'$4'}
							>
								<Text color={'$color.white'}>SAVE</Text>
							</Button>
							<Button
								onPress={() => {
									setEditVisible(false);
									setError('');
								}}
								backgroundColor={'$color.caution'}
								size={'$buttons.md'}
								borderRadius={'$4'}
							>
								<Text>CLOSE</Text>
							</Button>
						</XStack>
					</YStack>
				</YStack>
			)}
		</SafeAreaView>
	);
}
