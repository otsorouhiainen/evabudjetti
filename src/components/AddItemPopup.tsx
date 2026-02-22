import * as Crypto from 'expo-crypto';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input, SizableText, Text, XStack, YStack } from 'tamagui';
import type { Item, Recurrence } from '../constants/wizardConfig';
import { MultiPlatformDatePicker } from './MultiPlatformDatePicker';
import { Placeholder } from 'drizzle-orm';

type AddItemPopupProps = {
	onAdd: (item: Item) => void;
	onClose: () => void;
};

const AddItemPopup = ({ onAdd, onClose }: AddItemPopupProps) => {
	const REOCCURENCE_OPTIONS: Recurrence[] = [
		'daily',
		'weekly',
		'monthly',
		'yearly',
		'custom',
	];
	const [name, setName] = useState<string>('');
	const [amount, setAmount] = useState<number | null>(null);
	const [date, setDate] = useState<Date>(new Date());
	const [reoccurence, setReoccurence] = useState<Recurrence>('monthly');
	const [reoccurenceInterval, setReoccurenceInterval] = useState<
		number | undefined
	>(undefined);
	const isDisabled =
		!name.trim() ||
		Number.isNaN(Number(amount)) ||
		Number(amount) <= 0 ||
		!date;

	const handleAdd = () => {
		onAdd({
			id: Crypto.randomUUID(),
			category: 'uncategorized',
			name: name.trim(),
			amount: amount,
			recurrence: reoccurence,
			date: date,
			recurrenceInterval:
				reoccurence === 'custom' ? reoccurenceInterval : undefined,
		} as Item);
		setName('');
		setAmount(null);
		setReoccurence('monthly');
		setReoccurenceInterval(undefined);
		setDate(new Date());
		onClose();
	};

	return (
		<View style={styles.container}>
			<YStack backgroundColor="$background" style={styles.card}>
				<SizableText color="$primary100" size="$title2">
					Add a new item
				</SizableText>
				<View style={styles.inputsContainer}>
					<View style={styles.singleItemContainer}>
						<SizableText color="$primary100" size="$title3">
							Name
						</SizableText>
						<Input color="$primary100"
							placeholder="Write the name here"
							style={styles.input}
							value={name}
							onChangeText={setName}
						/>
					</View>
					<View style={styles.singleItemContainer}>
						<SizableText color="$primary100" size="$title3">
							Amount
						</SizableText>
						<Input color="$primary100"
							placeholder="Write the amount here (€)"
							style={styles.input}
							keyboardType="numeric"
							onChangeText={(text) => {
								const input = Number(text); 
								if(
									!Number.isNaN(input) &&
									input >= 0
									) {
									setAmount(input);
								}
								else{
									setAmount(NaN);	
								}									
							}}
						/>
					</View>
					<View>
						<SizableText color="$primary100" size="$title3">
							Reoccurence
						</SizableText>
						<View
							style={{
								flexDirection: 'row',
								gap: 12,
								alignItems: 'center',
								width: '100%',
								height: '25%',
								flexWrap: 'wrap',
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
										backgroundColor={
											reoccurence === opt
												? '$primary200'
												: '$primary300'
										}
										onPress={() => setReoccurence(opt)}
										style={{
											height: '100%',
										}}
									>
										<SizableText
											color={
												reoccurence === opt
													? '$white'
													: '$primary100'
											}
											size="$title3"
										>
											{opt.charAt(0).toUpperCase() +
												opt.slice(1)}
										</SizableText>
									</Button>
								</View>
							))}
							{reoccurence === 'custom' && (
								<XStack gap={10} alignItems="center">
									<Text color="$primary100" fontWeight={"bold"} >
										Interval (days)
									</Text>
									<Input color="$primary100"
										style={{ height: '50%' }}
										placeholder="Interval (days)"
										keyboardType="numeric"
										onChangeText={(text) => {
											const interval = Number(text);
											if (
												!Number.isNaN(interval) &&
												interval > 0
											) {
												setReoccurenceInterval(
													interval,
												);
											}
										}}
									/>
								</XStack>
							)}
						</View>
					</View>
					<XStack
						style={{
							height: '10%',
							alignItems: 'center',
							gap: 10,
						}}
					>
						<SizableText
							style={{ height: '100%' }}
							color="$primary100"
							size="$title3"
						>
							Date:
						</SizableText>
						<MultiPlatformDatePicker
							value={date}
							onChange={setDate}
						/>
					</XStack>
				</View>

				<View style={styles.buttonRow}>
					<Button
						borderRadius={28}
						backgroundColor={
							isDisabled ? '$primary300' : '$primary200'
						}
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
						backgroundColor="$caution"
						style={styles.button}
						onPress={onClose}
					>
						<SizableText color="$primary100" size="$title3">
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
		height: '13%',
	},
	dateInput: {
		height: '60%',
		width: '30%',
	},
	dateContainer: {
		flexDirection: 'row',
		height: '20%',
		alignItems: 'center',
		gap: 20,
	},
	card: {
		width: '90%',
		padding: 20,
		height: '70%',
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
