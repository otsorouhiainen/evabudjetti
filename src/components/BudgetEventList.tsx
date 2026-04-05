import { ChevronDown, ChevronUp, Pencil } from '@tamagui/lucide-icons';
import { isToday } from 'date-fns';
import { date } from 'drizzle-orm/mysql-core';
import type { Router } from 'expo-router';
import { Button, styled, Text, XStack, YStack } from 'tamagui';
import { LOCALE } from '../constants/index';
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
	return (
		<YStack gap={8} marginBottom={8}>
			{title !== '' && (
				<Text fontSize={'$title1'} fontWeight={'700'} mt={'$2'}>
					{title}
				</Text>
			)}

			{txns.map((txn) => (
				<XStack
					style={{
						padding: 10,
						borderRadius: 10,
						borderWidth: 2,
						margin: -2,
					}}
					backgroundColor={'$white'}
					borderColor={
						isToday(txn.date) ? '$primary200' : '$primary300'
					}
					key={`${txn.realTransaction?.id ?? txn.plannedTransaction?.id}-${txn.date.getTime()}`}
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
								{new Date(txn.date).toLocaleDateString(LOCALE)}
							</Text>
							<Text fontSize="$body" fontWeight="600">
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
						<Text
							flex={1}
							numberOfLines={1}
							ellipsizeMode="tail"
							fontSize="$body"
						>
							{txn.name}
						</Text>
					</YStack>
				</XStack>
			))}
		</YStack>
	);
};

export default BudgetEventList;
