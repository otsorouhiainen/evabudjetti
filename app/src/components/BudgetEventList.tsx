import { Pencil } from '@tamagui/lucide-icons';
import type { Dispatch, SetStateAction } from 'react';
import { Button, Text, XStack, YStack } from 'tamagui';
import { StyledListItem } from '@/app/src/components/StyledListItem';
import type { Item } from '../../../src/constants/wizardConfig';
import { LOCALE } from '../constants';

interface Props {
	txns: Item[];
	title: string;
	setEditVisible: (state: boolean) => void;
	setEditingTxn: (txn: Item) => void;
	setInputDate: Dispatch<SetStateAction<string>>;
	formatCurrency: (value: number, hideSign?: boolean) => string;
}

export const BudgetEventList: React.FC<Props> = ({
	txns,
	title,
	setEditVisible,
	setEditingTxn,
	setInputDate,
	formatCurrency,
}) => {
	return (
		<YStack gap={'$2'}>
			<Text fontSize={'$title1'} fontWeight={'700'} mt={'$2'}>
				{title}
			</Text>

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
						<Button
							size="$buttons.sm"
							circular
							backgroundColor="transparent"
							icon={Pencil}
							onPress={() => {
								setEditVisible(true);
								setEditingTxn(txn);
								setInputDate(
									txn.date.toLocaleDateString(LOCALE),
								);
							}}
						/>
					</XStack>
				</StyledListItem>
			))}
		</YStack>
	);
};
