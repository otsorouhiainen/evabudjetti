import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Tabs, Text, YStack } from 'tamagui';

import TransactionDayView from '@/src/components/BudgetDayView';
import TransactionMonthView from '@/src/components/BudgetMonthView';
import TransactionYearView from '@/src/components/BudgetYearView';
import StyledTab from '@/src/components/StyledTab';
import type { Item } from '@/src/constants/wizardConfig';
import usePlannedTransactionsStore from '@/src/store/usePlannedTransactionsStore';
import useRealTransactionsStore from '@/src/store/useRealTransactionsStore';

export default function Transactions() {
	const storeTransactionsForTwoYears = usePlannedTransactionsStore(
		(state) => state.transactionsForTwoYears,
	);
	const realTransactions = useRealTransactionsStore(
		(state) => state.transactions,
	);

	const [currentDate, setcurrentDate] = useState(new Date());
	const [transactions, setTransactions] = useState<Item[]>([]);
	const [selectedTab, setSelectedTab] = useState('day');

	const router = useRouter();

	useEffect(() => {
		// Combine planned (budget) and real (actual) transactions
		const combined = [
			...(storeTransactionsForTwoYears ?? []),
			...(realTransactions ?? []),
		];
		setTransactions(combined);
	}, [storeTransactionsForTwoYears, realTransactions]);

	return (
		<SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
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
						<TransactionDayView
							onDateChange={setcurrentDate}
							currentDate={currentDate}
							transactions={transactions}
							onAddPress={() => {
								router.push('/add_transaction2');
							}}
						/>
					</Tabs.Content>
					<Tabs.Content value="month" flex={1}>
						<TransactionMonthView
							currentDate={currentDate}
							transactions={transactions}
							router={router}
							onDateChange={setcurrentDate}
						/>
					</Tabs.Content>
					<Tabs.Content value="year" flex={1}>
						<TransactionYearView
							onDateChange={setcurrentDate}
							currentDate={currentDate}
							transactions={transactions}
						/>
					</Tabs.Content>
				</Tabs>
			</YStack>
		</SafeAreaView>
	);
}
