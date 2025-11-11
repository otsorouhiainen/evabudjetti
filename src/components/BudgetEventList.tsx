<<<<<<< HEAD
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '@ui-kitten/components';
import i18next from 'i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { customTheme } from '../theme/eva-theme';
=======
import { Pencil } from '@tamagui/lucide-icons';
import type { Dispatch, SetStateAction } from 'react';
import { Button, Text, XStack, YStack } from 'tamagui';
import { StyledListItem } from '@/app/src/components/StyledListItem';
import { LOCALE } from '../../app/src/constants/';
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
	txns: Txn[];
	title: string;
	setEditVisible: (state: boolean) => void;
	setEditingTxn: (txn: Txn) => void;
<<<<<<< HEAD
=======
	setInputDate: Dispatch<SetStateAction<string>>;
>>>>>>> 82f09c4740ca5cf8d6d8d665381bc9d3ed78a95a
	formatCurrency: (value: number, hideSign?: boolean) => string;
}

export const BudgetEventList: React.FC<Props> = ({
	txns,
	title,
	setEditVisible,
	setEditingTxn,
<<<<<<< HEAD
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
=======
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
>>>>>>> 82f09c4740ca5cf8d6d8d665381bc9d3ed78a95a
