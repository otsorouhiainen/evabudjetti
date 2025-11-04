import { Button, SizableText, XStack } from 'tamagui';
import { TransactionType } from '../../app/add_transaction';

interface TransactionTypeSegmentProps {
	type: TransactionType;
	setType: (type: TransactionType) => void;
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
		backgroundColor="$segmentWrap"
	>
		{[TransactionType.Income, TransactionType.Expense].map((opt) => (
			<Button
				key={opt}
				onPress={() => setType(opt)}
				backgroundColor={opt === type ? '$primary500' : '$white'}
				borderRadius={20}
				padding={16}
				paddingHorizontal={16}
			>
				<SizableText fontWeight="700">{opt}</SizableText>
			</Button>
		))}
	</XStack>
);
