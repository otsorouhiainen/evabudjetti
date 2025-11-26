import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, Tabs, Text, XStack, YStack } from 'tamagui';
import type { Item } from '../src/constants/wizardConfig';
import BudgetDayView from './src/components/BudgetDayView';
import BudgetMonthView from './src/components/BudgetMonthView';
import BudgetYearView from './src/components/BudgetYearView';
import StyledTab from './src/components/StyledTab';
import { isValidDate, parseTxnDate } from './src/utils/budgetUtils';

const currentYear = new Date().getFullYear();
const getDate = (day: string, month: string) =>
	parseTxnDate(`${day}.${month}.${currentYear}`);

const MOCK_TX: Item[] = [
	{
		id: 1,
		name: 'Rent',
		category: 'Housing',
		type: 'expense',
		date: getDate('22', '12'),
		amount: -830.5,
		reoccurence: 'monthly',
		reoccurenceInterval: 1,
	},
	{
		id: 2,
		name: 'Study benefit',
		category: 'Benefits',
		type: 'income',
		date: getDate('25', '12'),
		amount: 280,
		reoccurence: 'monthly',
		reoccurenceInterval: 1,
	},
	{
		id: 3,
		name: 'Study loan',
		category: 'Loans',
		type: 'income',
		date: getDate('06', '12'),
		amount: 300,
		reoccurence: 'monthly',
		reoccurenceInterval: 1,
	},
	{
		id: 4,
		name: 'Pet food',
		category: 'Pets',
		type: 'expense',
		date: getDate('20', '12'),
		amount: -60,
		reoccurence: 'monthly',
		reoccurenceInterval: 1,
	},
	{
		id: 5,
		name: 'Phone bill',
		category: 'Communication',
		type: 'expense',
		date: getDate('01', '12'),
		amount: -27,
		reoccurence: 'monthly',
		reoccurenceInterval: 1,
	},
	{
		id: 6,
		name: 'Netflix',
		category: 'Entertainment',
		type: 'expense',
		date: getDate('22', '12'),
		amount: -12.99,
		reoccurence: 'monthly',
		reoccurenceInterval: 1,
	},
	{
		id: 7,
		name: 'Spotify',
		category: 'Entertainment',
		type: 'expense',
		date: getDate('13', '10'),
		amount: -15.99,
		reoccurence: 'monthly',
		reoccurenceInterval: 1,
	},
	{
		id: 8,
		name: 'Water',
		category: 'Utilities',
		type: 'expense',
		date: getDate('11', '10'),
		amount: -25,
		reoccurence: 'monthly',
		reoccurenceInterval: 1,
	},
	{
		id: 9,
		name: 'Salary',
		category: 'Income',
		type: 'income',
		date: getDate('15', '10'),
		amount: 340.79,
		reoccurence: 'monthly',
		reoccurenceInterval: 1,
	},
	{
		id: 10,
		name: 'Housing Benefit',
		category: 'Benefits',
		type: 'income',
		date: getDate('01', '10'),
		amount: 150,
		reoccurence: 'monthly',
		reoccurenceInterval: 1,
	},
];

export default function Budget() {
	const [editOpen, setEditVisible] = useState(false);
	const [editingTxn, setEditingTxn] = useState<Item | null>(null);
	const [currentDate, setcurrentDate] = useState(new Date());
	const [transactions, setTransactions] = useState<Item[]>(MOCK_TX);
	const [selectedTab, setSelectedTab] = useState('day');
	const [error, setError] = useState('');
	const [dateInput, setDateInput] = useState('');
	const [amountInput, setAmountInput] = useState(''); // Add this new state

	const router = useRouter();

	const handleSave = () => {
		if (!editingTxn) return;
		setTransactions((prev) =>
			prev.map((tx) => (tx.id === editingTxn.id ? editingTxn : tx)),
		);
		setEditVisible(false);
		setEditingTxn(null);
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
		}
	};

	const handleAmountChange = (text: string) => {
		setAmountInput(text); // Store the input string

		// Allow empty string or just "-" without updating the transaction
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
								setAmountInput(String(txn.amount)); // Initialize amount input
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
							value={amountInput} // Use amountInput state
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
