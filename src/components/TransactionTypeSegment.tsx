import { Text } from '@ui-kitten/components';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { TransactionType } from '../../app/add_transaction';
import { customTheme } from '../theme/eva-theme';

interface TransactionTypeSegmentProps {
	type: TransactionType;
	setType: (type: TransactionType) => void;
}

export const TransactionTypeSegment: React.FC<TransactionTypeSegmentProps> = ({
	type,
	setType,
}) => (
	<View style={styles.segmentWrap}>
		{[TransactionType.Income, TransactionType.Expense].map((opt) => (
			<TouchableOpacity
				key={opt}
				activeOpacity={0.9}
				onPress={() => setType(opt)}
				style={[
					styles.segmentItem,
					opt === type && {
						backgroundColor: customTheme['color-primary-500'],
					},
				]}
			>
				<Text
					category="s1"
					style={[
						styles.segmentText,
						opt === type
							? { color: customTheme['color-white'] }
							: { color: customTheme['color-primary-500'] },
					]}
				>
					{opt}
				</Text>
			</TouchableOpacity>
		))}
	</View>
);

const styles = StyleSheet.create({
	segmentWrap: {
		flexDirection: 'row',
		alignSelf: 'flex-start',
		backgroundColor: customTheme['color-segment-wrap'],
		borderRadius: 24,
		padding: 4,
		gap: 6,
	},
	segmentItem: {
		paddingVertical: 6,
		paddingHorizontal: 16,
		borderRadius: 20,
		backgroundColor: customTheme['color-white'],
	},
	segmentText: { fontWeight: '700' },
});
