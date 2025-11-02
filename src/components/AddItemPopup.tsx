import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input, SizableText } from 'tamagui';
import type { Item, Reoccurence } from '../constants/wizardConfig';

type AddItemPopupProps = {
	onAdd: (item: Item) => void;
	onClose: () => void;
};

function isNullOrEmpty(value: string | null | undefined): boolean {
	return value === null || value === undefined || value.trim() === '';
}

const AddItemPopup = ({ onAdd, onClose }: AddItemPopupProps) => {
	const [name, setName] = React.useState<string>('');
	const [amount, setAmount] = React.useState<string>('');
	const [reoccurence, setReoccurence] = React.useState<Reoccurence>('daily');
	const [date, setDate] = React.useState<Date | null>(null);
	const [selectedIndex, setSelectedIndex] = React.useState<
		IndexPath | IndexPath[]
	>(new IndexPath(0));

	const isDisabled =
		!name.trim() ||
		Number.isNaN(Number(amount)) ||
		Number(amount) <= 0 ||
		!date;

	const handleAdd = () => {
		onAdd({
			name: name.trim(),
			amount: Number(amount.trim()),
			reoccurence: reoccurence,
			dates: [date || new Date()],
		} as Item);
		setName('');
		setAmount('');
		setReoccurence('daily');
		setDate(null);
		onClose();
	};

	return (
		<View style={styles.container}>
			<View style={styles.card}>
				<SizableText>Add a new item</SizableText>
				<View style={styles.inputsContainer}>
					<SizableText>Name</SizableText>
					<Input
						placeholder="Write the name here"
						style={styles.input}
						value={name}
						onChangeText={setName}
						status={isNullOrEmpty(name) ? 'warning' : 'success'}
					/>
					<SizableText>Amount</SizableText>
					<Input
						placeholder="Write the amount here (€)"
						style={styles.input}
						keyboardType="numeric"
						value={`${amount}€`}
						onChangeText={setAmount}
						status={isNullOrEmpty(amount) ? 'warning' : 'success'}
					/>
					<SizableText>Reoccurence</SizableText>
					<Select
						value={reoccurence}
						selectedIndex={selectedIndex}
						onSelect={setSelectedIndex}
					>
						<SelectItem title={'daily'} />
						<SelectItem title={'weekly'} />
						<SelectItem title={'monthly'} />
						<SelectItem title={'yearly'} />
						<SelectItem title={'custom'} />
					</Select>
					<SizableText>Date</SizableText>
					<Datepicker
						placeholder="Select the starting date"
						style={styles.input}
						date={date}
						onSelect={setDate}
						status={!date ? 'warning' : 'success'}
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
