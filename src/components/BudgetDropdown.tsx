<<<<<<< HEAD
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card, Icon, Text } from '@ui-kitten/components';
import i18next from 'i18next';
import type { Dispatch, SetStateAction } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { customTheme } from '../theme/eva-theme';
=======
import { ChevronDown, ChevronRight, Pencil } from '@tamagui/lucide-icons';
import type { Dispatch, SetStateAction } from 'react';
import { Button, Text, XStack, YStack } from 'tamagui';
import { StyledCard } from '@/app/src/components/styledCard';
import { LOCALE } from '@/app/src/constants';
>>>>>>> 82f09c4740ca5cf8d6d8d665381bc9d3ed78a95a

type Txn = {
	id: string;
	name: string;
<<<<<<< HEAD
	date: string; // dd.mm.yyyy
	amount: number; // + or -
=======
	date: Date; // dd.mm.yyyy
	amount: number | string; // string essential for input rendering
>>>>>>> 82f09c4740ca5cf8d6d8d665381bc9d3ed78a95a
};

interface Props {
	name: string;
	txns: Txn[];
	isOpen: boolean;
	setEditVisible: (state: boolean) => void;
	setEditingTxn: (txn: Txn) => void;
<<<<<<< HEAD
=======
	setInputDate: Dispatch<SetStateAction<string>>;
>>>>>>> 82f09c4740ca5cf8d6d8d665381bc9d3ed78a95a
	openDropdown: Dispatch<SetStateAction<boolean>>;
	formatCurrency: (value: number, hideSign?: boolean) => string;
}

export const BudgetDropdown: React.FC<Props> = ({
	txns,
	name,
	setEditVisible,
	setEditingTxn,
<<<<<<< HEAD
=======
	setInputDate,
>>>>>>> 82f09c4740ca5cf8d6d8d665381bc9d3ed78a95a
	openDropdown,
	isOpen,
	formatCurrency,
}) => {
	return (
<<<<<<< HEAD
		<Card disabled style={styles.totalCard}>
			<TouchableOpacity
				style={styles.totalHeader}
				onPress={() => openDropdown((v) => !v)}
				activeOpacity={0.8}
			>
				<Text category="s1" style={styles.totalTitle}>
					{name}
				</Text>
				<View style={styles.totalRight}>
					<Text
						category="s1"
						style={{
							fontWeight: '800',
						}}
					>
						{formatCurrency(
							txns.reduce((acc, txn) => acc + txn.amount, 0),
						)}
					</Text>
					<Icon
						name={
							isOpen
								? 'chevron-down-outline'
								: 'chevron-right-outline'
						}
						style={styles.chev}
					/>
				</View>
			</TouchableOpacity>

			{/* txn dropdown */}
			{isOpen && (
				<View style={styles.container}>
					{txns.map((txn) => (
						<View key={txn.id} style={styles.totalHeader}>
							<Text category="s1">{i18next.t(txn.name)}</Text>
							<View style={styles.totalRight}>
								<Text category="s1">
									{formatCurrency(txn.amount)}
								</Text>
								<TouchableOpacity
									onPress={() => {
										setEditVisible(true);
										setEditingTxn(txn);
									}}
								>
									<MaterialCommunityIcons
										name="pencil-outline"
										size={18}
										color={customTheme['color-black']}
									/>
								</TouchableOpacity>
							</View>
						</View>
					))}
				</View>
			)}
		</Card>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 10,
	},
	totalHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	totalRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
	totalCard: {
		borderRadius: 14,
		paddingVertical: 6,
		paddingHorizontal: 10,
		backgroundColor: customTheme['color-primary-600'],
		shadowColor: customTheme['color-black'],
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.08,
		shadowRadius: 6,
		elevation: 4,
	},
	totalTitle: { fontWeight: '800' },
	chev: { width: 18, height: 18, tintColor: customTheme['color-black'] },
});
=======
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
>>>>>>> 82f09c4740ca5cf8d6d8d665381bc9d3ed78a95a
