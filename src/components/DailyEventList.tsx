import type { Router } from 'expo-router';
import { Text, YStack } from 'tamagui';
import type { TransactionOccurrence } from '../dataModel';
import DailyEventListItem from './DailyEventListItem';

interface Props {
	txnsByDate: TransactionOccurrence[][];
	title: string;
	selectedDate: Date;
	isCurrent: boolean;
	router?: Router;
	formatCurrency: (value: number, hideSign?: boolean) => string;
}

const BudgetEventList: React.FC<Props> = ({
	txnsByDate,
	title,
	selectedDate,
	isCurrent,
	router,
	formatCurrency,
}) => {
	/* 
	Function to calculate the total balance change for 
	all transactions on a given date
	*/
	const sumOfTxns = (index: number) => {
		const dTxns = txnsByDate[index];
		let sum = 0;
		for (const t of dTxns) {
			if (t.type === 'income') sum += t.amount;
			else sum -= t.amount;
		}
		return sum;
	};

	// Render unique item when selected day has no transactions
	if (isCurrent && txnsByDate.length === 0) {
		return (
			<YStack gap={8} marginBottom={8}>
				{title !== '' && (
					<Text fontSize={'$title1'} fontWeight={'700'} mt={'$2'}>
						{title}
					</Text>
				)}
				<DailyEventListItem
					dTxns={[]}
					date={selectedDate}
					sum={0}
					isCurrent={isCurrent}
					router={router}
					formatCurrency={formatCurrency}
					key={`${selectedDate.getTime()}`}
				></DailyEventListItem>
			</YStack>
		);
	} else {
		return (
			<YStack gap={8} marginBottom={8}>
				{title !== '' && (
					<Text fontSize={'$title1'} fontWeight={'700'} mt={'$2'}>
						{title}
					</Text>
				)}
				{txnsByDate.map((dTxns, index) => (
					<DailyEventListItem
						dTxns={dTxns}
						date={dTxns[0].date}
						sum={sumOfTxns(index)}
						isCurrent={isCurrent}
						router={router}
						formatCurrency={formatCurrency}
						key={`${dTxns[0].date.getTime()}`}
					></DailyEventListItem>
				))}
			</YStack>
		);
	}
};

export default BudgetEventList;
