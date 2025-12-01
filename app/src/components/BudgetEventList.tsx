import StyledListItem from '@/app/src/components/StyledListItem';
import { Pencil } from '@tamagui/lucide-icons';
import type { Dispatch, SetStateAction } from 'react';
import { Button, Text, XStack, YStack } from 'tamagui';
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

const BudgetEventList: React.FC<Props> = ({
	txns,
	title,
	setEditVisible,
	setEditingTxn,
	setInputDate,
	formatCurrency,
}) => {
	return (
		<YStack gap={8}>
			<Text fontSize={'$title1'} fontWeight={'700'} mt={'$2'}>
				{title}
			</Text>

			{txns.map((txn) => (
				<StyledListItem key={txn.id}>
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
						gap="$2"
						backgroundColor="transparent"
						alignItems="center"
						justifyContent="flex-end"
						minWidth={100}
					>
						<Text fontSize="$body" fontWeight="600">
							{txn.type === 'income' ? '+' : '-'}
							{formatCurrency(Number(txn.amount))}
						</Text>
						<Button
							size="$2"
							circular
							chromeless
							icon={<Pencil size={16} />}
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

export default BudgetEventList;
