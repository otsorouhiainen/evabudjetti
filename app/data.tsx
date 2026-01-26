import { YStack, View, Text} from 'tamagui';
import { useState } from 'react';
import { prisma } from '../prisma/prisma';

//spending.transactions.slice(0, 5).map(() => {

export default function Data() {

	const transactions = prisma.spending.useFindFirst({
		include: {
    		transactions: true,
		},
	})?.transactions;

	if (!transactions) {
		return null;
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
					{index + 1}. {transaction.description}
				</Text>
				))}
			</View>

			<YStack height={48} />
		</YStack>
	);
} 
