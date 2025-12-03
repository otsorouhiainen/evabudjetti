import { Button, SizableText, XStack } from 'tamagui';

interface TransactionTypeSegmentProps {
	type: TransactionType;
	setType: (type: TransactionType) => void;
}

export enum TransactionType {
	Income = 'Income',
	Expense = 'Expense',
}

export const TransactionTypeSegment: React.FC<TransactionTypeSegmentProps> = ({
	type,
	setType,
}) => (
	<XStack
		alignSelf="flex-start"
		borderRadius={24}
		padding={4}
		gap={6}
		backgroundColor="$primary300"
	>
		{[TransactionType.Income, TransactionType.Expense].map((opt) => (
			<Button
				key={opt}
				onPress={() => setType(opt)}
				backgroundColor={opt === type ? '$primary200' : '$white'}
				borderRadius={20}
				size="$buttons.md"
			>
				<SizableText height={24} fontWeight="700">
					{opt}
				</SizableText>
			</Button>
		))}
	</XStack>
);
