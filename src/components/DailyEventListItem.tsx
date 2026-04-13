import { ChevronDown, ChevronUp, Pencil } from '@tamagui/lucide-icons';
import { useMemo, useState } from 'react';
import { Button, Text, XStack, YStack } from 'tamagui';
import { LOCALE } from '../constants/index';
import type { TransactionOccurrence } from '../dataModel';

interface Props {
	dTxns: TransactionOccurrence[];
	date: Date;
	noTxnNotice: string;
	sum: number;
	isSelected: boolean;
	onEditPress?: (txn: TransactionOccurrence) => void;
	formatCurrency: (value: number, hideSign?: boolean) => string;
}

const DailyEventListItem: React.FC<Props> = ({
	dTxns,
	date,
	noTxnNotice,
	sum,
	isSelected,
	onEditPress,
	formatCurrency,
}) => {
	const [isOpen, setOpen] = useState(isSelected);

	// Automatically open list item when selected
	useMemo(() => {
		if (isSelected) setOpen(true);
	}, [isSelected]);

	return (
		<XStack
			style={{
				padding: 10,
				borderRadius: 10,
				borderWidth: isSelected ? 4 : 3,
				margin: -2,
			}}
			key={`${date.getTime()}`}
			backgroundColor={'$white'}
			borderColor={isSelected ? '$primary200' : '$primary300'}
			pressStyle={{ backgroundColor: '$primary300' }}
			onPress={() => setOpen(!isOpen)}
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
						{date.toLocaleDateString(LOCALE)}
					</Text>
					<Text fontSize="$body" fontWeight="700">
						{formatCurrency(sum)}
					</Text>
					{isOpen ? (
						<ChevronUp size={20} />
					) : (
						<ChevronDown size={20} />
					)}
				</XStack>
				{isOpen &&
					(dTxns[0].name !== '' ? (
						dTxns.map((txn) => (
							<XStack
								gap={10}
								backgroundColor="transparent"
								alignItems="center"
								justifyContent="flex-end"
								key={`${txn.realTransaction?.id ?? txn.plannedTransaction?.id}-${txn.date.getTime()}`}
								maxWidth={'90%'}
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
								{/* Edit button only for real (DB-persisted) transactions */}
								{onEditPress && txn.realTransaction && (
									<Button
										size="$buttons.sm"
										circular
										backgroundColor="transparent"
										icon={Pencil}
										onPress={() => onEditPress(txn)}
									/>
								)}
							</XStack>
						))
					) : (
						<Text
							style={{ fontStyle: 'italic' }}
							color="$primary200"
						>
							{noTxnNotice}
						</Text>
					))}
			</YStack>
		</XStack>
	);
};

export default DailyEventListItem;
