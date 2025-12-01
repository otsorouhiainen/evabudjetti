import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, Tabs, Text, XStack, YStack } from 'tamagui';
import type { Item } from '../src/constants/wizardConfig';
import usePlannedTransactionsStore from '../src/store/usePlannedTransactionsStore';
import BudgetDayView from './src/components/BudgetDayView';
import BudgetMonthView from './src/components/BudgetMonthView';
import BudgetYearView from './src/components/BudgetYearView';
import StyledTab from './src/components/StyledTab';
import { isValidDate, parseTxnDate } from './src/utils/budgetUtils';

export default function Budget() {
	const storeTransactions = usePlannedTransactionsStore(
		(state) => state.transactions,
	);

	const [editOpen, setEditVisible] = useState(false);
	const [editingTxn, setEditingTxn] = useState<Item | null>(null);
	const [currentDate, setcurrentDate] = useState(new Date());
	const [transactions, setTransactions] = useState<Item[]>([]);
	const [selectedTab, setSelectedTab] = useState('day');
	const [error, setError] = useState('');
	const [dateInput, setDateInput] = useState('');
	const [amountInput, setAmountInput] = useState('');

	const router = useRouter();

	/*useEffect(() => {
		fetchTransactions();
	}, [fetchPlanned, fetchTransactions]);*/

	useEffect(() => {
		setTransactions(storeTransactions);
	}, [storeTransactions]);

	const handleSave = () => {
		if (!editingTxn) return;
		setTransactions((prev) =>
			prev.map((tx) => (tx.id === editingTxn.id ? editingTxn : tx)),
		);
		// TODO: Update store here if needed
		setEditVisible(false);
		setEditingTxn(null);
	};

	const handleDateChange = (text: string) => {
		setDateInput(text);

		if (text === '') {
			setError('');
			return; // don’t touch txn.date
		}

		const regex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
		if (regex.test(text)) {
			const newDate = parseTxnDate(text);
			// Check if date is valid (not Invalid Date)
			if (!Number.isNaN(newDate.getTime())) {
				setError('');
				setEditingTxn((prev) =>
					prev ? { ...prev, date: newDate } : prev,
				);
			} else {
				setError('Invalid date');
			}
		} else {
			if (isValidDate(text)) {
				setError('');
				const newDate = parseTxnDate(text);
				setEditingTxn((prev) =>
					prev ? { ...prev, date: newDate } : prev,
				);
			} else {
				setError('Invalid date, use format: dd.mm.yyyy');
			}
		}
	};

	const handleAmountChange = (text: string) => {
		setAmountInput(text);

		if (text === '' || text === '-') {
			return;
		}

		const num = Number(text);
		if (Number.isFinite(num) && num !== 0) {
			setEditingTxn((prev) => (prev ? { ...prev, amount: num } : prev));
		}
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<YStack
				backgroundColor={'$color.white'}
				paddingTop={'$paddingmd'}
				paddingHorizontal={'$2'}
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
							flex={1}
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
						<StyledTab
							value="month"
							flex={1}
							borderTopLeftRadius={20}
							borderBottomLeftRadius={20}
						>
							<Text
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
					<Tabs.Content value="day" flex={1}>
						<BudgetDayView
							currentDate={currentDate}
							transactions={transactions}
							setInputDate={setDateInput}
							setEditVisible={setEditVisible}
							setEditingTxn={setEditingTxn}
							onAddPress={() => {
								router.push('/add_transaction');
							}}
							onEditPress={(txn) => {
								setEditingTxn(txn);
								setEditVisible(true);
								setDateInput(
									txn.date.toLocaleDateString('fi-FI'),
								);
								setAmountInput(String(txn.amount));
							}}
						/>
					</Tabs.Content>
					<Tabs.Content value="month" flex={1}>
						<BudgetMonthView
							currentDate={currentDate}
							transactions={transactions}
							onDateChange={setcurrentDate}
							setEditVisible={setEditVisible}
							setEditingTxn={setEditingTxn}
							setInputDate={setDateInput}
							editOpen={editOpen}
						/>
					</Tabs.Content>
					<Tabs.Content value="year" flex={1}>
						<BudgetYearView
							ReceivedCurrentDate={currentDate}
							transactions={transactions}
						/>
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
					zIndex={10}
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
							value={amountInput}
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
