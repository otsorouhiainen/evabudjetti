import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card, Icon, Text } from '@ui-kitten/components';
import type { Dispatch, SetStateAction } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { customTheme } from '../theme/eva-theme';

type Txn = {
	id: string;
	name: string;
	date: string; // dd.mm.yyyy
	amount: number; // + or -
};

interface Props {
	name: string;
	txns: Txn[];
	isOpen: boolean;
	setEditVisible: (state: boolean) => void;
	setEditingTxn: (txn: Txn) => void;
	openDropdown: Dispatch<SetStateAction<boolean>>;
	formatCurrency: (value: number, hideSign?: boolean) => string;
}

export const BudgetDropdown: React.FC<Props> = ({
	txns,
	name,
	setEditVisible,
	setEditingTxn,
	openDropdown,
	isOpen,
	formatCurrency,
}) => {
	return (
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
							<Text category="s1">{txn.name}</Text>
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
