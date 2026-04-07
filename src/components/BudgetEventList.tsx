import type { Router } from 'expo-router';
import { Text, YStack } from 'tamagui';
import type { TransactionOccurrence } from '../dataModel';
import StyledListItem from './StyledListItem';

interface Props {
	txns: TransactionOccurrence[];
	title: string;
	router?: Router;
	formatCurrency: (value: number, hideSign?: boolean) => string;
}

const BudgetEventList: React.FC<Props> = ({
	txns,
	title,
	router,
	formatCurrency,
}) => {
	// Grouping the transactions by date
	const txnsByDate: TransactionOccurrence[][] = [];
	for (const txn of txns) {
		const date = txn.date.getDate();
		let dateFound = false;
		for (const dTxns of txnsByDate) {
			if (dTxns[0].date.getDate() === date) {
				dTxns.push(txn);
				dateFound = true;
				break;
			}
		}
		if (!dateFound) txnsByDate.push([txn]);
	}
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

	return (
		<YStack gap={8} marginBottom={8}>
			{title !== '' && (
				<Text fontSize={'$title1'} fontWeight={'700'} mt={'$2'}>
					{title}
				</Text>
			)}
			{txnsByDate.map((dTxns, index) => (
				<StyledListItem
					dTxns={dTxns}
					sum={sumOfTxns(index)}
					router={router}
					formatCurrency={formatCurrency}
					key={`${dTxns[0].date.getTime()}`}
				></StyledListItem>
			))}
		</YStack>
	);
};

export default BudgetEventList;
