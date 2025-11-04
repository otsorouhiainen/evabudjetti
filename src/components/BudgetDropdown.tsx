import { ChevronDown, ChevronRight, Pencil } from '@tamagui/lucide-icons';
import type { Dispatch, SetStateAction } from 'react';
import { Button, Text, XStack, YStack } from 'tamagui';
import { StyledCard } from '@/app/src/components/styledCard';

type Txn = {
	id: string;
	name: string;
	date: Date; // dd.mm.yyyy
	amount: number | string; // string essential for input rendering
};

const LOCALE = 'en-US';

interface Props {
	name: string;
	txns: Txn[];
	isOpen: boolean;
	setEditVisible: (state: boolean) => void;
	setEditingTxn: (txn: Txn) => void;
	setInputDate: Dispatch<SetStateAction<string>>;
	openDropdown: Dispatch<SetStateAction<boolean>>;
	formatCurrency: (value: number, hideSign?: boolean) => string;
}

export const BudgetDropdown: React.FC<Props> = ({
	txns,
	name,
	setEditVisible,
	setEditingTxn,
	setInputDate,
	openDropdown,
	isOpen,
	formatCurrency,
}) => {
	return (
		<StyledCard>
			{/* Header - Clickable */}
			<StyledCard.Header
				onPress={() => openDropdown((v) => !v)}
				padding={'$1'}
			>
				<XStack justifyContent="space-between" alignItems="center">
					<Text
						fontSize="$body"
						fontWeight="700"
						color={'$color.white'}
						ml="$2"
					>
						{name}
					</Text>

					<XStack alignItems="center" gap="$1">
						<Text
							fontSize="$title1"
							fontWeight="600"
							color={'$color.white'}
						>
							{formatCurrency(
								txns.reduce(
									(acc, txn) => acc + Number(txn.amount),
									0,
								),
							)}
						</Text>
						<Button
							disabled
							color={'$color.white'}
							size="$6"
							backgroundColor="$transparent"
							circular
							icon={isOpen ? ChevronDown : ChevronRight}
						/>
					</XStack>
				</XStack>
			</StyledCard.Header>

			{/* Dropdown Content */}
			{isOpen && (
				<YStack mb="$3" gap={'$1'}>
					{txns.map((txn) => (
						<XStack
							key={txn.id}
							justifyContent="space-between"
							alignItems="center"
							ml="$3"
							mr={'$3'}
						>
							<Text flex={1} color={'$color.white'}>
								{txn.name}
							</Text>

							<XStack alignItems="center" gap="$2">
								<Text
									fontSize="$title1"
									minWidth={80}
									textAlign="right"
									color={'$color.white'}
								>
									{formatCurrency(Number(txn.amount))}
								</Text>
								<Button
									size="$buttons.sm"
									color={'$color.white'}
									circular
									icon={Pencil}
									onPress={() => {
										setEditVisible(true);
										setEditingTxn(txn);
										setInputDate(
											txn.date.toLocaleString(LOCALE),
										);
									}}
									chromeless
								/>
							</XStack>
						</XStack>
					))}
				</YStack>
			)}
		</StyledCard>
	);
};
