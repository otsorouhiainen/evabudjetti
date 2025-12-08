import { StyleSheet } from 'react-native';
import { Progress, Text, View, XStack } from 'tamagui';

export const Scene1 = ({
	budget,
	spent,
}: {
	budget: number;
	spent: number;
}) => {
	const spentPercent = budget === 0 ? 0 : Math.round((spent / budget) * 100);

	const progressHeight = 20;
	const isNegative = spentPercent < 0;
	const isPositive = spentPercent > 0;

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
				  backgroundColor="#4CAF50"
				  borderWidth={2}
				  borderColor="black"
				  borderRadius={2}
				  width="100%"
				>
				  <Progress.Indicator
					backgroundColor="#800020"
					height={progressHeight}
					width={`${100}%`}  // Cap it at 100%
					// Don't set width here - let Progress component control it via the value prop
				  />
				</Progress>
				<Text>{} </Text>
				<Text> Vs total budget {budget} </Text>
			</View>

			<XStack width="100%" gap="$4">
				<XStack width="50%" justifyContent="center" alignItems="center">
					<Text fontSize={36}> {100 - spentPercent}% </Text>
				</XStack>

				<XStack width="50%" justifyContent="center" alignItems="center">
					<Text flexWrap="wrap">
						{isPositive
							? 'Left of budget'
							: 'Over budget'}
					</Text>
				</XStack>
			</XStack>
		</View>
	);
};

//test script
//	localStorage.setItem('balance-storage', JSON.stringify({ state: { balance: 100, disposable: 50 }, version: 0 }));
//	location.reload();

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#eaeaea',
		outlineColor: '#000000',
		borderWidth: 2,
		borderRadius: 10,
		gap: 10,
	},
});
