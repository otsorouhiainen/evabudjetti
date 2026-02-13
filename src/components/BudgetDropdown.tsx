import { ChevronDown, ChevronRight, Pencil } from '@tamagui/lucide-icons';
import type { Router } from 'expo-router';
import type { Dispatch, SetStateAction } from 'react';
import { Button, Text, XStack, YStack } from 'tamagui';
import type { Item } from '../constants/wizardConfig';
import StyledCard from './styledCard';

interface Props {
	name: string;
	txns: Item[];
	isOpen: boolean;
	router?: Router;
	openDropdown: Dispatch<SetStateAction<boolean>>;
	formatCurrency: (value: number, hideSign?: boolean) => string;
}

const BudgetDropdown: React.FC<Props> = ({
	txns,
	name,
	router,
	openDropdown,
	isOpen,
	formatCurrency,
}) => {
	return (
		<StyledCard>
			{/* Header - Clickable */}
			<StyledCard.Header
				onPress={() => openDropdown((v) => !v)}
				padding={15}
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
					{txns.map((txn, index) => (
						<XStack
							key={`${txn.id}-${index}`}
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
								{/* Edit button rendered only if router exists */}
								{router && (
									<Button
										size="$buttons.sm"
										color={'$color.white'}
										circular
										icon={Pencil}
										onPress={() => {
											router.push('/budget_wizard');
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
