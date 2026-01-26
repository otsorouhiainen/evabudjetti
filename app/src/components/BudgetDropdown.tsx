import { ChevronDown, ChevronRight, Pencil } from '@tamagui/lucide-icons';
import type { Dispatch, SetStateAction } from 'react';
import { Button, Text, XStack, YStack } from 'tamagui';
import StyledCard from '@/app/src/components/styledCard';
import { LOCALE } from '@/app/src/constants';
import type { Item } from '../../../src/constants/wizardConfig';

interface Props {
	name: string;
	txns: Item[];
	isOpen: boolean;
	setEditVisible?: (state: boolean) => void;
	setEditingTxn?: (txn: Item) => void;
	setInputDate?: Dispatch<SetStateAction<string>>;
	openDropdown: Dispatch<SetStateAction<boolean>>;
	formatCurrency: (value: number, hideSign?: boolean) => string;
}

const BudgetDropdown: React.FC<Props> = ({
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
				padding={5}
			>
				<XStack justifyContent="space-between" alignItems="center">
					<Text
						fontSize="$body"
						fontWeight="700"
						color={'$color.white'}
						ml={10}
					>
						{name}
					</Text>

					<XStack alignItems="center" gap={5}>
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
							size={30}
							backgroundColor="$transparent"
							circular
							icon={isOpen ? ChevronDown : ChevronRight}
						/>
					</XStack>
				</XStack>
			</StyledCard.Header>

			{/* Dropdown Content */}
			{isOpen && (
				<YStack mb={15} gap={5}>
					{txns.map((txn) => (
						<XStack
							key={txn.id}
							justifyContent="space-between"
							alignItems="center"
							ml={15}
							mr={15}
						>
							<Text flex={1} color={'$color.white'}>
								{txn.name}
							</Text>

							<XStack alignItems="center" gap={10}>
								<Text
									fontSize="$title1"
									minWidth={80}
									textAlign="right"
									color={'$color.white'}
								>
									{formatCurrency(Number(txn.amount))}
								</Text>
								{setEditVisible &&
									setEditingTxn &&
									setInputDate && (
										<Button
											size="$buttons.sm"
											color={'$color.white'}
											circular
											icon={Pencil}
											onPress={() => {
												setEditVisible(true);
												setEditingTxn(txn);
												setInputDate(
													txn.date.toLocaleDateString(
														LOCALE,
													),
												);
											}}
											chromeless
										/>
									)}
							</XStack>
						</XStack>
					))}
				</YStack>
			)}
		</StyledCard>
	);
};

export default BudgetDropdown;
