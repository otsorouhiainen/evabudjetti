import { Button, StyleSheet, Text, View } from 'react-native';
import usePlannedTransactionsStore from '@/src/store/usePlannedTransactionsStore';
import useCounterStore from '../src/store/useCounterStore'; // Adjust the import path
import usePersistantCounterStore from '../src/store/usePersistantCounterStore';

const CounterDisplay = () => {
	const transactions = usePlannedTransactionsStore(
		(state) => state.transactions,
	);
	const addTransaction = usePlannedTransactionsStore((state) => state.add);
	const count = useCounterStore((state) => state.count);
	const persCount = usePersistantCounterStore((state) => state.count);

	const increment = useCounterStore((state) => state.increment);
	const decrement = useCounterStore((state) => state.decrement);
	const reset = useCounterStore((state) => state.reset);

	const persIncrement = usePersistantCounterStore((state) => state.increment);
	const persDecrement = usePersistantCounterStore((state) => state.decrement);
	const persReset = usePersistantCounterStore((state) => state.reset);

	return (
		<View style={styles.container}>
			<Button
				title="Add Planned Transaction"
				onPress={() =>
					addTransaction({
						id: 3,
						name: 'New Transaction',
						type: 'expense',
						amount: 50,
						reoccurence: 'monthly',
						date: new Date(),
					})
				}
			/>
			<Text style={styles.text}>
				Planned Transactions Count: {transactions.length}
			</Text>
			{transactions.map((t) => (
				<Text key={t.name} style={styles.text}>
					{t.name}
				</Text>
			))}

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
