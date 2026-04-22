import { ChevronDown, ChevronUp, Pencil } from '@tamagui/lucide-icons';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
	onEditPlannedPress?: (txn: TransactionOccurrence) => void;
	formatCurrency: (value: number, hideSign?: boolean) => string;
}

const DailyEventListItem: React.FC<Props> = ({
	dTxns,
	date,
	noTxnNotice,
	sum,
	isSelected,
	onEditPress,
	onEditPlannedPress,
	formatCurrency,
}) => {
	const { t } = useTranslation();
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
						dTxns.map((txn, index) => {
							const itemKey =
								txn.realTransaction?.id != null
									? `r-${txn.realTransaction.id}`
									: txn.plannedTransaction?.id != null
										? `p-${txn.plannedTransaction.id}-${txn.date.getTime()}`
										: `f-${txn.date.getTime()}-${txn.name}-${txn.amount}-${index}`;

							const isUnconfirmedPlanned =
								!!txn.plannedTransaction && !txn.realTransaction;

							return (
								<XStack
									gap={10}
									backgroundColor="transparent"
									alignItems="center"
									justifyContent="flex-end"
									key={itemKey}
									maxWidth={'90%'}
									opacity={isUnconfirmedPlanned ? 0.65 : 1}
								>
									<YStack flex={1} gap={2}>
										<Text
											fontWeight="400"
											textAlign="left"
											fontSize="$body"
											color={
												isUnconfirmedPlanned
													? '$gray600'
													: '$color'
											}
											fontStyle={
												isUnconfirmedPlanned
													? 'italic'
													: 'normal'
											}
										>
											{txn.name}
										</Text>
										{/* Badge: unconfirmed planned */}
										{isUnconfirmedPlanned && (
											<Text
												fontSize={10}
												color="$gray500"
												borderWidth={1}
												borderColor="$gray400"
												borderRadius={4}
												paddingHorizontal={4}
												paddingVertical={1}
												alignSelf="flex-start"
											>
												{t('Budgeted badge')}
											</Text>
										)}
									</YStack>
									<Text
										fontSize="$body"
										fontWeight="400"
										color={
											isUnconfirmedPlanned
												? '$gray600'
												: '$color'
										}
									>
										{txn.type === 'income' ? '+' : '-'}
										{formatCurrency(Number(txn.amount))}
									</Text>
									{/* Edit button for real (DB-persisted) transactions */}
									{onEditPress && txn.realTransaction && (
										<Button
											size="$buttons.sm"
											circular
											backgroundColor="transparent"
											icon={Pencil}
											onPress={() => onEditPress(txn)}
										/>
									)}
									{/* Confirm/edit button for planned transactions without a real transaction */}
									{onEditPlannedPress &&
										isUnconfirmedPlanned && (
											<Button
												size="$buttons.sm"
												circular
												backgroundColor="transparent"
												icon={Pencil}
												onPress={() =>
													onEditPlannedPress(txn)
												}
											/>
										)}
								</XStack>
							);
						})
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
