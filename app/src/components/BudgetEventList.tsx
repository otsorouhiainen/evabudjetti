import { Pencil } from '@tamagui/lucide-icons';
import type { Router } from 'expo-router';
import { Button, Text, XStack, YStack } from 'tamagui';
import StyledListItem from '@/app/src/components/StyledListItem';
import type { Item } from '../../../src/constants/wizardConfig';
import { LOCALE } from '../constants';

interface Props {
	txns: Item[];
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
		<YStack gap={8}>
			{title !== '' && (
				<Text fontSize={'$title1'} fontWeight={'700'} mt={'$2'}>
					{title}
				</Text>
			)}

			{txns.map((txn, index) => (
				<StyledListItem key={`${txn.id}-${index}`}>
					<Text
						flex={1}
						numberOfLines={1}
						ellipsizeMode="tail"
						fontSize="$body"
					>
						{txn.name}
					</Text>
					<Text
						flex={1}
						fontWeight="400"
						textAlign="center"
						fontSize="$body"
					>
						{new Date(txn.date).toLocaleDateString(LOCALE)}
					</Text>
					<XStack
						gap={10}
						backgroundColor="transparent"
						alignItems="center"
						justifyContent="flex-end"
						minWidth={100}
					>
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
				</StyledListItem>
			))}
		</YStack>
	);
};

export default BudgetEventList;
