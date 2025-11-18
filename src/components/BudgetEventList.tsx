import { Pencil } from '@tamagui/lucide-icons';
import type { Dispatch, SetStateAction } from 'react';
import { Button, Text, XStack, YStack } from 'tamagui';
import { StyledListItem } from '@/app/src/components/StyledListItem';
import { LOCALE } from '../../app/src/constants/';

type Txn = {
	id: string;
	name: string;
	date: Date; // dd.mm.yyyy
	amount: number | string; // string essential for input rendering
};

interface Props {
	txns: Txn[];
	title: string;
	setEditVisible: (state: boolean) => void;
	setEditingTxn: (txn: Txn) => void;
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
								setInputDate(txn.date.toLocaleString(LOCALE));
							}}
						/>
					</XStack>
				</StyledListItem>
			))}
		</YStack>
	);
};
