import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '@ui-kitten/components';
import i18next from 'i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { customTheme } from '../theme/eva-theme';

type Txn = {
	id: string;
	name: string;
	date: string; // dd.mm.yyyy
	amount: number; // + or -
};

interface Props {
	txns: Txn[];
	title: string;
	setEditVisible: (state: boolean) => void;
	setEditingTxn: (txn: Txn) => void;
	formatCurrency: (value: number, hideSign?: boolean) => string;
}

export const BudgetEventList: React.FC<Props> = ({
	txns,
	title,
	setEditVisible,
	setEditingTxn,
	formatCurrency,
}) => {
	return (
		<View style={styles.listWrap}>
			<Text category="s1" style={styles.sectionTitle}>
				{title}
			</Text>

			{txns.map((t) => (
				<View key={t.id} style={styles.pill}>
					<Text style={styles.pillName}>{i18next.t(t.name)}</Text>
					<Text appearance="hint" style={styles.pillDate}>
						{t.date}
					</Text>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							gap: 8,
						}}
					>
						<Text
							style={[
								styles.pillAmt,
								{
									color:
										t.amount >= 0
											? customTheme['color-primary-300']
											: customTheme['color-black'],
								},
							]}
						>
							{t.amount > 0 ? '+' : ''}
							{formatCurrency(t.amount)}
						</Text>

						<TouchableOpacity
							onPress={() => {
								setEditVisible(true);
								setEditingTxn(t);
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
	);
};
const styles = StyleSheet.create({
	listWrap: { gap: 8 },
	pill: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: customTheme['color-primary-600'],
		borderRadius: 12,
		paddingVertical: 10,
		paddingHorizontal: 12,
		gap: 10,
	},
	pillName: { flex: 1, fontWeight: '700' },
	pillDate: { width: 100, textAlign: 'center' },
	pillAmt: { width: 70, textAlign: 'right', fontWeight: '800' },
	sectionTitle: { marginTop: 8, marginBottom: 4, fontWeight: '800' },
});
