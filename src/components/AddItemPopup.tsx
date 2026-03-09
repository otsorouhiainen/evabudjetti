import { Check } from '@tamagui/lucide-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import {
	Button,
	Checkbox,
	Input,
	SizableText,
	Text,
	XStack,
	YStack,
} from 'tamagui';
import type { PlannedTransaction, RecurrenceBase } from '../dataModel';
import { MultiPlatformDatePicker } from './MultiPlatformDatePicker';

type AddItemPopupProps = {
	onAdd: (item: PlannedTransaction) => void;
	onClose: () => void;
};

const AddItemPopup = ({ onAdd, onClose }: AddItemPopupProps) => {
	const REOCCURENCE_OPTIONS: RecurrenceBase[] = [
		'day',
		'week',
		'month',
		'year',
	];
	const { t } = useTranslation();
	const [name, setName] = useState<string>('');
	const [amount, setAmount] = useState<number | null>(null);
	const [startDate, setStartDate] = useState<Date>(new Date());
	const [endDate, setEndDate] = useState<Date | null>(null);
	const [reoccurence, setReoccurence] = useState<RecurrenceBase>('month');
	const [reoccurenceInterval, setReoccurenceInterval] = useState<
		number | undefined
	>(undefined);
	const isDisabled =
		!name.trim() ||
		Number.isNaN(Number(amount)) ||
		Number(amount) <= 0 ||
		!startDate;
	const hasEndDate = endDate !== null;
	const handleAdd = () => {
		onAdd({
			categoryId: 0,
			name: name.trim(),
			amount: amount,
			recurrenceBase: reoccurence,
			startDate: startDate,
			endDate: endDate,
			recurrenceInterval: reoccurenceInterval,
		} as PlannedTransaction);
		setName('');
		setAmount(null);
		setReoccurence('month');
		setReoccurenceInterval(undefined);
		setStartDate(new Date());
		onClose();
	};

	return (
		<View style={styles.container}>
			<YStack backgroundColor="$background" style={styles.card}>
				<SizableText color="$primary100" size="$title2">
					{t('Add a new item')}
				</SizableText>
				<View style={styles.inputsContainer}>
					<View style={styles.singleItemContainer}>
						<SizableText color="$primary100" size="$title3">
							{t('Name')}
						</SizableText>
						<Input
							color="$primary100"
							placeholder={t('Write the name here')}
							style={styles.input}
							value={name}
							onChangeText={setName}
						/>
					</View>
					<View style={styles.singleItemContainer}>
						<SizableText color="$primary100" size="$title3">
							{t('Amount')}
						</SizableText>
						<Input
							color="$primary100"
							placeholder={t('Write the amount here (€)')}
							style={styles.input}
							keyboardType="numeric"
							onChangeText={(text) => {
								const input = Number(text);
								if (!Number.isNaN(input) && input >= 0) {
									setAmount(input);
								} else {
									setAmount(NaN);
								}
							}}
						/>
					</View>
					<View>
						<SizableText color="$primary100" size="$title3">
							{t('Reoccurrence')}
						</SizableText>
						<View
							style={{
								flexDirection: 'row',
								gap: 8,
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
											{t(
												"Rec_"+opt,
											)}
										</SizableText>
									</Button>
								</View>
							))}
							<XStack gap={10} alignItems="center">
								<Text color="$primary100" fontWeight={'bold'}>
									{t('Interval')}:
								</Text>
								<Input
									color="$primary100"
									style={{ height: '50%' }}
									placeholder={t('Interval')}
									defaultValue="1"
									keyboardType="numeric"
									onChangeText={(text) => {
										const interval = Number(text);
										if (
											!Number.isNaN(interval) &&
											interval > 0
										) {
											setReoccurenceInterval(interval);
										}
									}}
								/>
							</XStack>
						</View>
					</View>
					<View style={{ paddingTop: 10, gap: 5 }}>
						<XStack
							style={{
								alignItems: 'center',
								gap: 10,
							}}
						>
							<SizableText
								style={{ height: '100%' }}
								color="$primary100"
								size="$title3"
							>
								{t('Start Date')}:
							</SizableText>
							<MultiPlatformDatePicker
								value={startDate}
								onChange={setStartDate}
							/>
						</XStack>
						<XStack
							style={{
								alignItems: 'center',
								gap: 5,
							}}
						>
							<SizableText
								style={{ height: '100%' }}
								color="$primary100"
								size="$title3"
							>
								{t('End Date')}:
							</SizableText>
							<Checkbox
								onCheckedChange={() =>
									hasEndDate
										? setEndDate(null)
										: setEndDate(new Date())
								}
								// Default end date should change based on interval?
								size="$8"
							>
								<Checkbox.Indicator>
									<Check />
								</Checkbox.Indicator>
							</Checkbox>

							{hasEndDate && (
								<MultiPlatformDatePicker
									value={endDate}
									onChange={setEndDate}
								/>
							)}
						</XStack>
					</View>
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
							{t('Add')}
						</SizableText>
					</Button>
					<Button
						borderRadius={28}
						backgroundColor="$caution"
						style={styles.button}
						onPress={onClose}
					>
						<SizableText color="$primary100" size="$title3">
							{t('Cancel')}
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
