import * as Crypto from 'expo-crypto';
import { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input, SizableText, Text, XStack, YStack, ScrollView } from 'tamagui';
import { Plus } from '@tamagui/lucide-icons';
import type { Item, Recurrence } from '../constants/wizardConfig';
import { MultiPlatformDatePicker } from './MultiPlatformDatePicker';
import { type Category, useCategoryStore } from '../store/categoryStore';

type AddItemPopupProps = {
	onAdd: (item: Item) => void;
	onClose: () => void;
	transactionType: 'income' | 'expense';
	initialData?: {
		name?: string;
		amount?: number;
		date?: Date;
		category?: string;
	};
};

const AddItemPopup = ({ onAdd, onClose, transactionType, initialData }: AddItemPopupProps) => {
	const [name, setName] = useState<string>('');
	const [amount, setAmount] = useState<number | null>(null);
	const [date, setDate] = useState<Date>(new Date());
	const [category, setCategory] = useState<string>('uncategorized');
	const [newCategoryName, setNewCategoryName] = useState<string>('');
	const [showCategoryInput, setShowCategoryInput] = useState(false);
	
	// Get categories from store
	const storeCategories = useCategoryStore();
	const addCategory = useCategoryStore((state) => state.addCategory);
	const categories = storeCategories.categories.filter((c) => c.type === transactionType);
	
	// Pre-fill with initial data if provided
	useEffect(() => {
		if (initialData) {
			if (initialData.name) setName(initialData.name);
			if (initialData.amount) setAmount(initialData.amount);
			if (initialData.date) setDate(initialData.date);
			if (initialData.category) setCategory(initialData.category);
		}
	}, [initialData]);
	
	const isDisabled =
		!name.trim() ||
		Number.isNaN(Number(amount)) ||
		Number(amount) <= 0 ||
		!date;

	const handleAddCategory = async () => {
		if (!newCategoryName.trim()) return;

		try {
			const newCat = {
				id: Crypto.randomUUID(),
				name: newCategoryName,
				type: transactionType,
				color: '#000000',
				icon: 'circle',
			};
			await addCategory(newCat);
			setCategory(newCat.id);
			setNewCategoryName('');
			setShowCategoryInput(false);
		} catch (e) {
			console.error('Failed to add category:', e);
		}
	};

	const handleAdd = () => {
		onAdd({
			id: Crypto.randomUUID(),
			category: category,
			name: name.trim(),
			amount: amount,
			recurrence: 'none',
			date: date,
		} as Item);
		setName('');
		setAmount(null);
<<<<<<< HEAD
		setCategory('uncategorized');
=======
		setReoccurence('monthly');
		setReoccurenceInterval(undefined);
>>>>>>> 97c47c4de0494e69497447711652e025a24c97c8
		setDate(new Date());
		onClose();
	};

	return (
		<View style={styles.container}>
			<YStack backgroundColor="$background" style={styles.card}>
<<<<<<< HEAD
				<SizableText color="$black" size="$title2">
					Add a new {transactionType}
				</SizableText>
				<ScrollView showsVerticalScrollIndicator={true}>
					<View style={styles.inputsContainer}>
						<View style={styles.singleItemContainer}>
							<SizableText color="$black" size="$title3">
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
							<SizableText color="$black" size="$title3">
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

						{/* Category Selection & Creation */}
						<View style={styles.categoryContainer}>
							<SizableText color="$black" size="$title3" marginBottom={8}>
								Category
							</SizableText>
							
							<XStack flexWrap="wrap" gap={8}>
								{/* Add Category Button */}
								<Button
									onPress={() => setShowCategoryInput(!showCategoryInput)}
									icon={Plus}
									size="$3"
									backgroundColor={showCategoryInput ? '$primary100' : '$white'}
								/>

								{/* Category Pills - Show All */}
								{categories.map((cat) => (
=======
				<SizableText color="$primary100" size="$title2">
					Add a new item
				</SizableText>
				<View style={styles.inputsContainer}>
					<View style={styles.singleItemContainer}>
						<SizableText color="$primary100" size="$title3">
							Name
						</SizableText>
						<Input
							color="$primary100"
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
						<Input
							color="$primary100"
							placeholder="Write the amount here (€)"
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
>>>>>>> 97c47c4de0494e69497447711652e025a24c97c8
									<Button
										key={cat.id}
										onPress={() => setCategory(cat.id)}
										backgroundColor={
											category === cat.id
												? '$primary200'
												: '$white'
										}
										size="$3"
									>
										<SizableText size="$body">
											{cat.name}
										</SizableText>
									</Button>
<<<<<<< HEAD
								))}
							</XStack>

							{/* New Category Input */}
							{showCategoryInput && (
								<XStack gap={8} marginTop={8}>
									<Input
										flex={1}
										placeholder="New category name"
										value={newCategoryName}
										onChangeText={setNewCategoryName}
										onSubmitEditing={handleAddCategory}
=======
								</View>
							))}
							{reoccurence === 'custom' && (
								<XStack gap={10} alignItems="center">
									<Text
										color="$primary100"
										fontWeight={'bold'}
									>
										Interval (days)
									</Text>
									<Input
										color="$primary100"
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
>>>>>>> 97c47c4de0494e69497447711652e025a24c97c8
									/>
									<Button
										onPress={handleAddCategory}
										backgroundColor="$primary200"
										disabled={!newCategoryName.trim()}
									>
										<SizableText color="$white">Add</SizableText>
									</Button>
								</XStack>
							)}
						</View>
<<<<<<< HEAD

						<XStack
							style={{
								height: '10%',
								alignItems: 'center',
								gap: 10,
							}}
=======
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
>>>>>>> 97c47c4de0494e69497447711652e025a24c97c8
						>
							<SizableText
								style={{ height: '100%' }}
								color="$black"
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
				</ScrollView>

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
		minHeight: 80,
		marginBottom: 10,
	},
	categoryContainer: {
		minHeight: 100,
		marginBottom: 10,
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
		maxHeight: '85%',
	},
	input: {
		height: 40,
		marginTop: 8,
	},
	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		height: 50,
		marginTop: 10,
	},
	inputsContainer: {
		marginVertical: 20,
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
