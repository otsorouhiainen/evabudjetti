import { Card, Icon, Text } from '@ui-kitten/components';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { customTheme } from '../theme/eva-theme';

interface TotalsCardProps {
	title: string;
	value: number;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function TotalsCard({ title, value, open, setOpen }: TotalsCardProps) {
	return (
		<Card disabled style={styles.totalCard}>
			<TouchableOpacity
				style={styles.totalHeader}
				onPress={() => setOpen((v) => !v)}
				activeOpacity={0.8}
			>
				<Text category="s1" style={styles.totalTitle}>
					{title}
				</Text>
				<View style={styles.totalRight}>
					<Text category="s1" style={{ fontWeight: '800' }}>
						{value.toFixed(0)},00€
					</Text>
					<Icon
						name={
							open
								? 'chevron-down-outline'
								: 'chevron-right-outline'
						}
						style={styles.chev}
					/>
				</View>
			</TouchableOpacity>
		</Card>
	);
}

const styles = StyleSheet.create({
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
	totalHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	totalTitle: { fontWeight: '800' },
	totalRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
	chev: { width: 18, height: 18, tintColor: customTheme['color-black'] },
});
