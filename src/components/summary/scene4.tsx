import { StyleSheet } from 'react-native';
import { Text, View, XStack } from 'tamagui';
import type Expense from '@/app/summary';

export const Scene4 = ({
	categories,
	upcoming,
}: { 
	categories: string[]; 
	upcoming: Expense[] 
}) => {
	const font = 12;

	return (
		<View>
			<View style={styles.container} padding={16} marginBottom={16}>
				<Text> Top 5 categories by spend </Text>
				<View>
					{' '}
					{categories.slice(0, 5).map((e, index) => (
						<Text
							style={styles.subContainer}
							key={e}
							fontSize={font}
						>
							{index + 1}. {e}{' '}
						</Text>
					))}{' '}
				</View>
			</View>

			<View style={styles.container} padding={16} marginBottom={16}>
				<Text> Upcoming expenses </Text>
				{upcoming.map((e) => (
					<XStack
						style={styles.subContainer}
						key={e.name}
						width="100%"
					>
						<Text width="33.33%" fontSize={font}>
							{e.name}
						</Text>

						<Text width="33.33%" fontSize={font} textAlign="center">
							{e.date}
						</Text>

						<Text width="33.33%" fontSize={font} textAlign="right">
							{e.amount}
						</Text>
					</XStack>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#D3D3D3',
		outlineColor: '#000000',
		borderWidth: 2,
		borderRadius: 10,
		gap: 10,
	},
	subContainer: {
		backgroundColor: '#eaeaea',
		outlineColor: '#000000',
		borderWidth: 1,
		borderRadius: 8,
		padding: 4,
		marginBottom: 8,
		gap: 10,
	},
});
