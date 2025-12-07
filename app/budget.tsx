import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Tabs, Text, YStack } from 'tamagui';
import type { Item } from '../src/constants/wizardConfig';
import usePlannedTransactionsStore from '../src/store/usePlannedTransactionsStore';
import BudgetDayView from './src/components/BudgetDayView';
import BudgetMonthView from './src/components/BudgetMonthView';
import BudgetYearView from './src/components/BudgetYearView';
import StyledTab from './src/components/StyledTab';

export default function Budget() {
	const storeTransactionsForTwoYears = usePlannedTransactionsStore(
		(state) => state.transactionsForTwoYears,
	);

	const [currentDate, setcurrentDate] = useState(new Date());
	const [transactions, setTransactions] = useState<Item[]>([]);
	const [selectedTab, setSelectedTab] = useState('day');

	const router = useRouter();

	/*useEffect(() => {
		fetchTransactions();
	}, [fetchPlanned, fetchTransactions]);*/

	useEffect(() => {
		setTransactions(storeTransactionsForTwoYears ?? []);
	}, [storeTransactionsForTwoYears]);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<YStack
				backgroundColor={'$color.white'}
				paddingTop={'$paddingmd'}
				paddingHorizontal={10}
				flex={1}
			>
				<Tabs
					value={selectedTab}
					onValueChange={(value) => {
						setSelectedTab(value);
						setcurrentDate(new Date());
					}}
					backgroundColor="transparent"
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
								{'Day'}
							</Text>
						</StyledTab>
						<StyledTab value="month" flex={1}>
							<Text
								color={
									selectedTab === 'month'
										? '$color.white'
										: '$color.black'
								}
							>
								{'Month'}
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
								{'Year'}
							</Text>
						</StyledTab>
					</Tabs.List>
					<Tabs.Content value="day" flex={1}>
						<BudgetDayView
							onDateChange={setcurrentDate}
							currentDate={currentDate}
							transactions={transactions}
							onAddPress={() => {
								router.push('/add_transaction');
							}}
						/>
					</Tabs.Content>
					<Tabs.Content value="month" flex={1}>
						<BudgetMonthView
							currentDate={currentDate}
							transactions={transactions}
							router={router}
							onDateChange={setcurrentDate}
						/>
					</Tabs.Content>
					<Tabs.Content value="year" flex={1}>
						<BudgetYearView
							onDateChange={setcurrentDate}
							currentDate={currentDate}
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
						<Text>{('Edit Transaction')}</Text>
						<Input
							height={40}
							maxLength={25}
							borderRadius={10}
							px={10}
							value={editingTxn?.name}
							marginVertical={10}
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
								fontSize={10}
								marginTop={5}
							>
								Amount must be greater than zero
							</Text>
						)}

						<Input
							height={40}
							px={10}
							keyboardType="numeric"
							maxLength={9}
							borderRadius={10}
							value={amountInput}
							onChangeText={handleAmountChange}
							borderColor={
								editingTxn?.amount === 0
									? '$color.danger500'
									: '$color.black'
							}
							marginVertical={10}
						/>
						{!editingTxn?.name && (
							<Text
								color="$color.danger500"
								fontSize={10}
								marginTop={5}
							>
								Name is required
							</Text>
						)}

						<Input
							height={40}
							px={10}
							value={dateInput}
							maxLength={10}
							borderRadius={10}
							onChangeText={handleDateChange}
							borderColor={
								error ? '$color.danger500' : '$color.black'
							}
							marginVertical={10}
						/>
						{error && (
							<Text
								color="$color.danger500"
								fontSize={10}
								marginTop={5}
							>
								Invalid date format
							</Text>
						)}
						<XStack gap={15}>
							<Button
								onPress={() => handleSave()}
								disabled={
									error !== '' || editingTxn?.amount === 0
								}
								backgroundColor={'$color.primary200'}
								size={'wrap-content'}
								borderRadius={'$4'}
							>
								<Text color={'$color.white'}>{('SAVE')}</Text>
							</Button>
							<Button
								onPress={() => {
									setEditVisible(false);
									setError('');
								}}
								backgroundColor={'$color.caution'}
								size={'$buttons.md'}
								borderRadius={20}
							>
								<Text color={"$color.black"}>{('CLOSE')}</Text>
							</Button>
						</XStack>
					</YStack>
				</YStack>
			)}*/}
		</SafeAreaView>
	);
}
