import { useEffect } from 'react';
import { Text, View, YStack } from 'tamagui';
import { useTransactionStore } from '../src/store/transactionStore';

export default function Data() {
	const { transactions, fetchTransactions, loading, error } =
		useTransactionStore();

	useEffect(() => {
		fetchTransactions();
	}, [fetchTransactions]);

	if (loading) {
		return <Text>Loading...</Text>;
	}

	if (error) {
		return <Text>Error: {error}</Text>;
	}

	if (!transactions || transactions.length === 0) {
		return <Text>No transactions found.</Text>;
	}

	return (
		<YStack
			flex={1}
			justifyContent="center"
			alignItems="center"
			overflow="scroll"
		>
			<View>
				{transactions.map((transaction, index) => (
					<Text key={transaction.id}>
						{index + 1}. {transaction.name}
					</Text>
				))}
			</View>

			<YStack height={48} />
		</YStack>
	);
}
