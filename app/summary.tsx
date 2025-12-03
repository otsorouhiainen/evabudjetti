import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Summary() {
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={styles.container}>
				<Text style={styles.text}>TODO: Summary page</Text>
			</View>
		</SafeAreaView>
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
