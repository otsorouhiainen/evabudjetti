import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input, SizableText, YStack } from 'tamagui';
import type { Item, Reoccurence } from '../constants/wizardConfig';
import { MultiPlatformDatePicker } from './MultiPlatformDatePicker';

const Platform = require('react-native').Platform;

type AddItemPopupProps = {
	onAdd: (item: Item) => void;
	onClose: () => void;
};

function isNullOrEmpty(value: string | null | undefined): boolean {
	return value === null || value === undefined || value.trim() === '';
}

const AddItemPopup = ({ onAdd, onClose }: AddItemPopupProps) => {
	const REOCCURENCE_OPTIONS: Reoccurence[] = [
		'daily',
		'weekly',
		'monthly',
		'yearly',
		'custom',
	];
	const [name, setName] = useState<string>('');
	const [amount, setAmount] = useState<number | null>(null);
	const [date, setDate] = useState<Date>(new Date());
	const [reoccurence, setReoccurence] = useState<Reoccurence>('daily');
	const [reoccurenceInterval, setReoccurenceInterval] = useState<
		number | undefined
	>(undefined);
	const [datePickerOpen, setDatePickerOpen] = useState(false);
	const isDisabled =
		!name.trim() ||
		Number.isNaN(Number(amount)) ||
		Number(amount) <= 0 ||
		!date;

	const handleAdd = () => {
		onAdd({
			name: name.trim(),
			amount: amount,
			reoccurence: reoccurence,
			date: date,
			reoccurenceInterval:
				reoccurence === 'custom' ? reoccurenceInterval : undefined,
		} as Item);
		setName('');
		setAmount(null);
		setReoccurence('daily');
		setReoccurenceInterval(undefined);
		setDate(new Date());
		onClose();
	};

	return (
		<View style={styles.container}>
			<YStack backgroundColor="$background" style={styles.card}>
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
						<View
							style={{
								flexDirection: 'row',
								gap: 12,
								alignItems: 'center',
							}}
						>
							{REOCCURENCE_OPTIONS.map((opt) => (
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										height: '100%',
										gap: 10,
									}}
									key={opt}
								>
									<Button
										borderRadius={20}
										backgroundColor={
											reoccurence === opt
												? '$primary300'
												: undefined
										}
										onPress={() => setReoccurence(opt)}
										style={{
											height: '100%',
											paddingHorizontal: 12,
											paddingVertical: 8,
										}}
									>
										<SizableText
											color={
												reoccurence === opt
													? '$white'
													: '$primary300'
											}
											size="$title3"
										>
											{opt.charAt(0).toUpperCase() +
												opt.slice(1)}
										</SizableText>
									</Button>
									{opt === 'custom' &&
										reoccurence === 'custom' && (
											<Input
												style={{ height: '100%' }}
												placeholder="Interval (days)"
												keyboardType="numeric"
												onChangeText={(text) => {
													const interval =
														Number(text);
													if (
														!Number.isNaN(
															interval,
														) &&
														interval > 0
													) {
														setReoccurenceInterval(
															interval,
														);
													}
												}}
											/>
										)}
								</View>
							))}
						</View>
					</View>
					<View
						style={{
							height: '10%',
							flexDirection: 'row',
							alignItems: 'center',
							gap: 10,
						}}
					>
						<SizableText
							style={{ height: '100%' }}
							color="$primary300"
							size="$title3"
						>
							Date:
						</SizableText>
						<MultiPlatformDatePicker
							value={date}
							onChange={setDate}
						/>
					</View>
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
			</YStack>
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
		padding: 20,
		height: '60%',
	},
	input: {
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
