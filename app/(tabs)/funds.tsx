import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack } from 'tamagui';

import DailyBalanceView from '@/src/components/DailyBalanceView';
import type { TransactionOccurrence } from '@/src/dataModel';
import { useOccurrencesAndBalances } from '@/src/finance/hook/useOccurrencesAndBalances';

export default function Funds() {
	const currentDate = new Date();
	const currentMonth = currentDate.getMonth();
	const currentYear = currentDate.getFullYear();

	// Fetch Occurrences and Balances for the next 2 years
	const occurrencesAndBalances = useOccurrencesAndBalances(
		currentYear,
		currentMonth,
		currentYear + 2,
		currentMonth,
	);
	const transactions: TransactionOccurrence[] = [];
	for (const month of occurrencesAndBalances) {
		for (const txn of month.transactionOccurrences) {
			transactions.push(txn);
		}
	}

	const [selectedDate, setselectedDate] = useState(currentDate);
	const selectedDay = selectedDate.getDate();
	const selectedYearStr = String(selectedDate.getFullYear());
	const selectedMonthStr =
		selectedDate.getMonth() < 9
			? String(`0${selectedDate.getMonth() + 1}`)
			: String(selectedDate.getMonth() + 1);

	const selectedDateMonthKey = `${selectedYearStr}-${selectedMonthStr}`;

	const selectedDayBalance = () => {
		for (const month of occurrencesAndBalances) {
			if (month.monthKey === selectedDateMonthKey) {
				return month.dailyBalances[selectedDay - 1]?.balance;
			}
		}
	};

	const router = useRouter();

	return (
		<SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
			<YStack
				backgroundColor={'$color.white'}
				paddingTop={'$paddingmd'}
				paddingHorizontal={10}
				flex={1}
			>
				<DailyBalanceView
					onDateChange={setselectedDate}
					selectedDate={selectedDate}
					dayBalance={selectedDayBalance()}
					transactions={transactions}
					onAddPress={() => {
						router.push('/add_transaction2');
					}}
				/>
			</YStack>
		</SafeAreaView>
	);
}
