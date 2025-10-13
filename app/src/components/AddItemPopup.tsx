import {
	Button,
	Datepicker,
	IndexPath,
	Input,
	Select,
	SelectItem,
	Text,
} from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { Item, Reoccurence } from '../constants/wizardConfig';

type AddItemPopupProps = {
	onAdd: (item: Item) => void;
	onClose: () => void;
};

const AddItemPopup = ({ onAdd, onClose }: AddItemPopupProps) => {
	const [name, setName] = React.useState<string>('');
	const [amount, setAmount] = React.useState<string>('');
	const [reoccurence, setReoccurence] = React.useState<Reoccurence>('daily');
	const [date, setDate] = React.useState<Date | null>(null);
	const [selectedIndex, setSelectedIndex] = React.useState<
		IndexPath | IndexPath[]
	>(new IndexPath(0));

	const handleAdd = () => {
		const parsed = Number(amount);
		if (!name.trim() || Number.isNaN(parsed)) return;
		onAdd({
			name: name.trim(),
			amount: parsed,
			reoccurence,
			dates: [date || new Date()],
		} as Item);
		setName('');
		setAmount('');
		setReoccurence('daily');
		setDate(null);
		onClose();
	};

	const isDisabled = !name.trim() || Number.isNaN(Number(amount));

	return (
		<View style={styles.container}>
			<View style={styles.card}>
				<Text>Add a new item</Text>
				<View style={styles.inputsContainer}>
					<Input
						placeholder="Name"
						style={styles.input}
						value={name}
						onChangeText={setName}
					/>

					<Input
						placeholder="Amount"
						style={styles.input}
						keyboardType="numeric"
						value={amount}
						onChangeText={setAmount}
					/>

					<Select
						placeholder="Reoccurence"
						value={reoccurence}
						selectedIndex={selectedIndex}
						onSelect={setSelectedIndex}
					>
						<SelectItem title={'daily'} />
						<SelectItem title={'weekly'} />
						<SelectItem title={'monthly'} />
					</Select>

					<Datepicker
						placeholder="Date (YYYY-MM-DD)"
						style={styles.input}
						date={date}
						onSelect={setDate}
					/>
				</View>

				<View style={styles.buttonRow}>
					<Button onPress={handleAdd} disabled={isDisabled}>
						Add
					</Button>
					<Button onPress={onClose}>Cancel</Button>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	card: {
		width: '90%',
		backgroundColor: '#fff',
		padding: 20,
	},
	input: {
		borderColor: '#ccc',
	},
	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	inputsContainer: {
		gap: 10,
		marginVertical: 20,
	},
});

export default AddItemPopup;
