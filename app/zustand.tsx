import { Button, StyleSheet, Text, View } from 'react-native';
import useCounterStore from '../src/store/useCounterStore'; // Adjust the import path
import usePersistentCounterStore from '../src/store/usePersistentCounterStore';

const CounterDisplay = () => {
	const count = useCounterStore((state) => state.count);
	const persCount = usePersistentCounterStore((state) => state.count);

	const increment = useCounterStore((state) => state.increment);
	const decrement = useCounterStore((state) => state.decrement);
	const reset = useCounterStore((state) => state.reset);

	const persIncrement = usePersistentCounterStore((state) => state.increment);
	const persDecrement = usePersistentCounterStore((state) => state.decrement);
	const persReset = usePersistentCounterStore((state) => state.reset);

	return (
		<View style={styles.container}>
			<Text style={styles.text}>This count will reset on refresh</Text>
			<Text style={styles.text}>The current count is: {count}</Text>

			<View style={styles.buttonRow}>
				<Button title="Increment" onPress={increment} />
				<Button title="Decrement" onPress={decrement} />
			</View>
			<Button title="Reset to 10" onPress={() => reset(10)} />

			<Text style={styles.text}>This count will persist</Text>
			<Text style={styles.text}>The current count is: {persCount}</Text>

			<View style={styles.buttonRow}>
				<Button title="Increment" onPress={persIncrement} />
				<Button title="Decrement" onPress={persDecrement} />
			</View>
			<Button title="Reset to 10" onPress={() => persReset(10)} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#f5f5f5',
		borderRadius: 8,
	},
	text: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		width: '100%',
		marginBottom: 10,
	},
});

export default CounterDisplay;
