import { StyleSheet, Text, View } from 'react-native';

export default function Summary() {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>TODO: Summary page</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 16,
	},
	text: {
		fontSize: 16,
		fontWeight: '700',
	},
});
