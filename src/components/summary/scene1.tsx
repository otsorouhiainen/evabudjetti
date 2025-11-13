import { StyleSheet } from 'react-native';
import { Progress, Text, View, XStack } from 'tamagui';

export const Scene1 = ({
	budget,
	expected,
	spent,
}: { 
	budget: number; 
	expected: number; 
	spent: number 
}) => {
	const spentPercent = Math.round((spent / expected) * 100);
	const progressHeight = 20;
	const isGood = spentPercent >= 0;

	return (
		<View>
			<View style={styles.container} padding={16} marginBottom={16}>
				<Text> Total budget </Text>

				<Text> {budget}€ </Text>
				<Progress
					value={100}
					size="$4"
					height={progressHeight}
					backgroundColor="#36454F"
					borderWidth={2}
					borderColor="black"
					borderRadius={2}
					width="100%"
				>
					<Progress.Indicator
						backgroundColor="#4CAF50"
						height={progressHeight}
						width={`${100}%`}
					/>
				</Progress>
			</View>

			<View style={styles.container} padding={16} marginBottom={16}>
				<Text> Actual spend </Text>

				<Text> {spent}€ </Text>

				<Progress
					value={spentPercent}
					size="$4"
					height={progressHeight}
					backgroundColor="#4CAF50 "
					borderWidth={2}
					borderColor="black"
					borderRadius={2}
					width="100%" // Add explicit width to Progress
				>
					<Progress.Indicator
						backgroundColor="#800020"
						height={progressHeight}
						width={`${spentPercent}%`} // Set width based on your value prop
					/>
				</Progress>
				<Text> Vs expected {expected} </Text>
			</View>

			<XStack width="100%" gap="$4">
				<XStack width="50%" justifyContent="center" alignItems="center">
					<Text fontSize={36}> {isGood ? '+' : '-'} </Text>
					<Text fontSize={36}> {100 - spentPercent}% </Text>
				</XStack>

				<XStack width="50%" justifyContent="center" alignItems="center">
					<Text flexWrap="wrap">
						{isGood
							? 'Better than estimate'
							: 'Worse than estimate'}
					</Text>
				</XStack>
			</XStack>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#eaeaea',
		outlineColor: '#000000',
		borderWidth: 2,
		borderRadius: 10,
		gap: 10,
	},
});
