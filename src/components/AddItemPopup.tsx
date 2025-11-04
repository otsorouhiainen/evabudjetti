import { Calendar } from '@tamagui/lucide-icons';
import { parseISO } from 'date-fns';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Button, Input, SizableText } from 'tamagui';
import type { Item, Reoccurence } from '../constants/wizardConfig';

const Platform = require('react-native').Platform;

type AddItemPopupProps = {
	onAdd: (item: Item) => void;
	onClose: () => void;
};

function isNullOrEmpty(value: string | null | undefined): boolean {
	return value === null || value === undefined || value.trim() === '';
}

const AddItemPopup = ({ onAdd, onClose }: AddItemPopupProps) => {
	const [name, setName] = useState<string>('');
	const [amount, setAmount] = useState<number | null>(null);
	const [reoccurence, setReoccurence] = useState<Reoccurence>('daily');
	const [editorDate, setDate] = useState<string>('');
	const [datePickerOpen, setDatePickerOpen] = useState(false);
	const isDisabled =
		!name.trim() ||
		Number.isNaN(Number(amount)) ||
		Number(amount) <= 0 ||
		!editorDate;

	const handleAdd = () => {
		onAdd({
			name: name.trim(),
			amount: amount,
			reoccurence: reoccurence,
			date: parseISO(editorDate),
		} as Item);
		setName('');
		setAmount(null);
		setReoccurence('daily');
		setDate('');
		onClose();
	};

	return (
		<View style={styles.container}>
			<DatePicker
				modal
				open={datePickerOpen}
				mode="date"
				date={editorDate ? parseISO(editorDate) : new Date()}
				onConfirm={(date) => {
					setDatePickerOpen(false);
					setDate(date.toISOString());
				}}
				onCancel={() => {
					setDatePickerOpen(false);
				}}
			/>
			<View style={styles.card}>
				<SizableText color="$primary300" size="$title2">
					Add a new item
				</SizableText>
				<View style={styles.inputsContainer}>
					<View style={styles.singleItemContainer}>
						<SizableText color="$primary300" size="$title3">
							Name
						</SizableText>
						<Input
							placeholder="Write the name here"
							style={styles.input}
							value={name}
							onChangeText={setName}
						/>
					</View>
					<View style={styles.singleItemContainer}>
						<SizableText color="$primary300" size="$title3">
							Amount
						</SizableText>
						<Input
							placeholder="Write the amount here (€)"
							style={styles.input}
							keyboardType="numeric"
							value={amount?.toString() || ''}
							onChangeText={(text) => setAmount(Number(text))}
						/>
					</View>
					<View style={styles.reoccurenceContainer}>
						<SizableText color="$primary300" size="$title3">
							Reoccurence
						</SizableText>
					</View>
					{Platform.OS === 'web' ? (
						<View style={styles.dateContainer}>
							<SizableText color="$primary300" size="$title3">
								Date:
							</SizableText>
							<Input
								placeholder="Write the date here (YYYY-MM-DD)"
								style={styles.dateInput}
								value={editorDate}
								onChangeText={(text: string) => {
									setDate(text);
								}}
							/>
						</View>
					) : (
						<View style={styles.dateContainer}>
							<SizableText color="$primary300" size="$title3">
								Date:{' '}
								{editorDate
									? parseISO(editorDate).toLocaleDateString()
									: ''}
							</SizableText>
							<Button
								icon={Calendar}
								style={styles.calendarIcon}
								onPress={() => setDatePickerOpen(true)}
							/>
						</View>
					)}
				</View>

				<View style={styles.buttonRow}>
					<Button
						borderRadius={28}
						backgroundColor="$primary300"
						style={styles.button}
						onPress={handleAdd}
						disabled={isDisabled}
					>
						<SizableText color="$white" size="$title3">
							Add
						</SizableText>
					</Button>
					<Button
						borderRadius={28}
						backgroundColor="$primary300"
						style={styles.button}
						onPress={onClose}
					>
						<SizableText color="$white" size="$title3">
							Cancel
						</SizableText>
					</Button>
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
	singleItemContainer: {
		height: '20%',
	},
	dateInput: {
		height: '60%',
		width: '30%',
	},
	reoccurenceContainer: {},
	dateContainer: {
		flexDirection: 'row',
		height: '20%',
		alignItems: 'center',
		gap: 20,
	},
	card: {
		width: '90%',
		backgroundColor: '#fff',
		padding: 20,
		height: '60%',
	},
	input: {
		borderColor: '#ccc',
		height: '100%',
	},
	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		height: '10%',
	},
	inputsContainer: {
		gap: 30,
		marginVertical: 20,
		height: '75%',
	},
	button: {
		width: '45%',
		height: '100%',
	},
	calendarIcon: {
		width: '10%',
		height: '100%',
	},
});

export default AddItemPopup;
