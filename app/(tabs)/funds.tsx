import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack } from 'tamagui';

import BudgetDayView from '@/src/components/BudgetDayView';
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
				<BudgetDayView
					onDateChange={setcurrentDate}
					currentDate={currentDate}
					transactions={transactions}
					onAddPress={() => {
						router.push('/add_transaction2');
					}}
				/>
			</YStack>
		</SafeAreaView>
	);
}
