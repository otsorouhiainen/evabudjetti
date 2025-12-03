import { Pencil } from '@tamagui/lucide-icons';
import { Button, Text, XStack, YStack } from 'tamagui';
import StyledListItem from '@/app/src/components/StyledListItem';
import type { Item } from '../../../src/constants/wizardConfig';
import { LOCALE } from '../constants';
import type { Router } from 'expo-router';

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
			{title !== "" && (
			<Text fontSize={'$title1'} fontWeight={'700'} mt={'$2'}>
				{title}
			</Text>)}

			{txns.map((txn) => (
				<StyledListItem key={txn.id}>
					<Text width={100}>{txn.name}</Text>
					<Text f={1} fontWeight={'$1'} textAlign="center">
						{txn.date.toLocaleDateString(LOCALE)}
					</Text>
					<XStack
						gap={8}
						backgroundColor={'transparent'}
						alignItems="center"
					>
						<Text>
							{Number(txn.amount) > 0 ? '+' : ''}
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
