import { useEffect } from 'react';
import { Button, Text, YStack } from 'tamagui';
import useRealTransactionsStore from '../src/store/useRealTransactionsStore';

export default function Data() {
	const { transactions, fetch, add } = useRealTransactionsStore();

	useEffect(() => {
		fetch();
	}, [fetch]);

	return (
		<YStack
			flex={1}
			justifyContent="center"
			alignItems="center"
			overflow="scroll"
		>
			<Text>Count: {transactions.length}</Text>
			<Button
				onPress={() =>
					add({
						id: Math.random().toString(36).substring(2, 15),
						name: 'Test Transaction',
						amount: 100,
						date: new Date(),
						category: 'other',
						type: 'expense',
						recurrence: 'none',
					})
				}
			>
				Add Test
			</Button>
			<YStack height={48} />
		</YStack>
	);
}
