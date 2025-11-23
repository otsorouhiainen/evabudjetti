import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, Tabs, Text, XStack, YStack } from 'tamagui';
import { StyledTab } from './src/components/StyledTab';
import {BudgetYearView} from './src/components/BudgetYearView'
import { 
  parseTxnDate, 
  isValidDate 
} from './src/utils/budgetUtils';
import { BudgetDayView } from './src/components/BudgetDayView';
import { BudgetMonthView } from './src/components/BudgetMonthView';
import type { Txn } from './src/constants/budget';


const MOCK_TX: Txn[] = [
	{ id: '1', name: 'Rent', date: parseTxnDate('22.10.2026'), amount: -830.5 },
	{
		id: '2',
		name: 'Study benefit',
		date: parseTxnDate('25.10.2025'),
		amount: +280,
	},
	{
		id: '3',
		name: 'Study loan',
		date: parseTxnDate('06.10.2025'),
		amount: +300,
	},
	{ id: '4', name: 'Pet', date: parseTxnDate('20.10.2026'), amount: -60 },
	{
		id: '5',
		name: 'Phone bill',
		date: parseTxnDate('01.10.2026'),
		amount: -27,
	},
	{
		id: '6',
		name: 'Netflix',
		date: parseTxnDate('22.10.2025'),
		amount: -12.99,
	},
	{
		id: '7',
		name: 'Spotify',
		date: parseTxnDate('13.10.2025'),
		amount: -15.99,
	},
	{ id: '8', name: 'Water', date: parseTxnDate('11.10.2025'), amount: -25 },
	{
		id: '9',
		name: 'Salary',
		date: parseTxnDate('15.10.2025'),
		amount: 340.79,
	},
	{
		id: '10',
		name: 'additional benefit',
		date: parseTxnDate('01.10.2025'),
		amount: 150,
	},
];

export default function Budget() {
	const [editOpen, setEditVisible] = useState(false);
	const [editingTxn, setEditingTxn] = useState<Txn | null>(null);
	const [currentDate, setcurrentDate] = useState(new Date());
	const [transactions, setTransactions] = useState<Txn[]>(MOCK_TX);
	const [selectedTab, setSelectedTab] = useState('day');
	const [error, setError] = useState('');
	const [dateInput, setDateInput] = useState('');

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
			// leave txn.date as-is
		}
	};

	const handleAmountChange = (text: string) => {
		setEditingTxn((prev) => {
			if (!prev) return prev;

			// Allow empty string or just "-" without forcing a number
			if (text === '' || text === '-') {
				return { ...prev, amount: text }; // or add a separate `amountInput` field
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
					<Tabs.Content value="day">
						<BudgetDayView 
							currentDate={currentDate}
							transactions={transactions}
							setInputDate={setDateInput}
							setEditVisible={setEditVisible}
							setEditingTxn={setEditingTxn}
							onAddPress={() => {
								setEditVisible(true);
								setEditingTxn({
									id: Math.random().toString(),
									name: '',
									date: currentDate,
									amount: '',
								});
							}}
							onEditPress={(txn) => {
								setEditingTxn(txn);
								setEditVisible(true);
								setDateInput(txn.date.toLocaleDateString('fi-FI')); // or your formatting util
							}}
						/>
					</Tabs.Content>
					<Tabs.Content value="month">
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
					<Tabs.Content value="year">
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
