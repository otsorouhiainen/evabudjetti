import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Tabs, Text, YStack } from 'tamagui';

import BudgetDayView from '@/src/components/BudgetDayView';
import StyledTab from '@/src/components/StyledTab';
import type { TransactionOccurrence } from '@/src/dataModel';
import usePlannedTransactionsStore from '@/src/store/usePlannedTransactionsStore';

export default function Funds() {
	const storeTransactionsForTwoYears = usePlannedTransactionsStore(
		(state) => state.transactionsForTwoYears,
	);

	const [currentDate, setcurrentDate] = useState(new Date());
	const [transactions, setTransactions] = useState<TransactionOccurrence[]>(
		[],
	);
	const [selectedTab, setSelectedTab] = useState('day');

	const { t } = useTranslation();

	const router = useRouter();

	useEffect(() => {
		setTransactions(storeTransactionsForTwoYears ?? []);
	}, [storeTransactionsForTwoYears]);

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
						minHeight={'$tabItemHeight'}
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
								numberOfLines={1}
								adjustsFontSizeToFit
								maxFontSizeMultiplier={1.3}
							>
								{t('Daily balance')}
							</Text>
						</StyledTab>
					</Tabs.List>
					<Tabs.Content value="day" flex={1}>
						<BudgetDayView
							onDateChange={setcurrentDate}
							currentDate={currentDate}
							transactions={transactions}
							onAddPress={() => {
								router.push('/add_transaction2');
							}}
						/>
					</Tabs.Content>
				</Tabs>
			</YStack>
		</SafeAreaView>
	);
}
