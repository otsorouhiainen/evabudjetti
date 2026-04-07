import { Pencil } from '@tamagui/lucide-icons';
import { isToday } from 'date-fns';
import type { Router } from 'expo-router';
import { Button, Text, XStack, YStack } from 'tamagui';
import { LOCALE } from '../constants/index';
import type { TransactionOccurrence } from '../dataModel';

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
				<XStack
					style={{
						padding: 10,
						borderRadius: 10,
						borderWidth: 2,
						margin: -2,
					}}
					key={`${dTxns[0].date.getTime()}`}
					backgroundColor={'$white'}
					borderColor={
						isToday(dTxns[0].date) ? '$primary200' : '$primary300'
					}
					value={false}
				>
					<YStack width="100%">
						<XStack
							gap={10}
							backgroundColor="transparent"
							alignItems="center"
							justifyContent="flex-end"
							minWidth={100}
						>
							<Text
								flex={1}
								fontWeight="700"
								textAlign="left"
								fontSize="$body"
							>
								{new Date(dTxns[0].date).toLocaleDateString(
									LOCALE,
								)}
							</Text>
							<Text fontSize="$body" fontWeight="700">
								{formatCurrency(sumOfTxns(index))}
							</Text>
						</XStack>
						{dTxns.map((txn) => (
							<XStack
								gap={10}
								backgroundColor="transparent"
								alignItems="center"
								justifyContent="flex-end"
								key={`${txn.realTransaction?.id ?? txn.plannedTransaction?.id}-${txn.date.getTime()}`}
								minWidth={100}
							>
								<Text
									flex={1}
									fontWeight="400"
									textAlign="left"
									fontSize="$body"
								>
									{txn.name}
								</Text>
								<Text fontSize="$body" fontWeight="400">
									{txn.type === 'income' ? '+' : '-'}
									{formatCurrency(Number(txn.amount))}
								</Text>
								{/* Edit button rendered only if router exists */}
								{router && (
									<Button
										size="$buttons.sm"
										circular
										backgroundColor="transparent"
										icon={Pencil}
										onPress={() => {
											router.push('/budget_wizard');
										}}
									/>
								)}
							</XStack>
						))}
					</YStack>
				</XStack>
			))}
		</YStack>
	);
};

export default BudgetEventList;
