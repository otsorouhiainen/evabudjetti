import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, Tabs, Text, XStack, YStack } from 'tamagui';
import type { Item } from '../src/constants/wizardConfig';
import  useRealTransactionsStore from '../src/store/useRealTransactionsStore';
import BudgetDayView from './src/components/BudgetDayView';
import BudgetMonthView from './src/components/BudgetMonthView';
import BudgetYearView from './src/components/BudgetYearView';
import StyledTab from './src/components/StyledTab';
import { isValidDate, parseTxnDate } from './src/utils/budgetUtils';
import i18next from 'i18next';

export default function Budget() {

	const MOCK_TX: Item[] = useRealTransactionsStore(
		(state) => state.transactions,
	);

	const [editOpen, setEditVisible] = useState(false);
	const [editingTxn, setEditingTxn] = useState<Item | null>(null);
	const [currentDate, setcurrentDate] = useState(new Date());
	const [transactions, setTransactions] = useState<Item[]>(MOCK_TX);
	const [selectedTab, setSelectedTab] = useState('day');
	const [error, setError] = useState('');
	const [dateInput, setDateInput] = useState('');
	const [amountInput, setAmountInput] = useState('');

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
			setError(i18next.t('Invalid date, use format: dd.mm.yyyy'));
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
				backgroundColor={"$transparent"}				
				paddingHorizontal={'$3'}
				f={1}
			>
				<Tabs
					value={selectedTab}
					onValueChange={setSelectedTab}
					backgroundColor="$transparent"
					f={1}
					flexDirection="column"
				>
					<Tabs.List
						flexDirection="row"
						height={'$tabItemHeight'}
						backgroundColor="$transparent"
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
								{i18next.t('Day')}
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
								{i18next.t('Month')}
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
								{i18next.t('Year')}
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
							router={router}
							onDateChange={setcurrentDate}
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
			{/* Edit modal
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
						<Text>{i18next.t('Edit Transaction')}</Text>
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
								size={'wrap-content'}
								borderRadius={'$4'}
							>
								<Text color={'$color.white'}>{i18next.t('SAVE')}</Text>
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
								<Text color={"$color.black"}>{i18next.t('CLOSE')}</Text>
							</Button>
						</XStack>
					</YStack>
				</YStack>
			)}*/}
		</SafeAreaView>
	);
}
