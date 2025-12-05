import { MultiPlatformDatePicker } from '@/src/components/MultiPlatformDatePicker';
import { type Category, useCategoryStore } from '@/src/store/categoryStore';
import usePlannedTransactionsStore from '@/src/store/usePlannedTransactionsStore';
import useRealTransactionsStore from '@/src/store/useRealTransactionsStore';
import * as Crypto from 'expo-crypto';
import { useEffect, useMemo, useState } from 'react';
import {
	AlertDialog,
	Button,
	Input,
	PortalProvider,
	ScrollView,
	SizableText,
	Stack,
	Text,
	XStack,
	YStack
} from 'tamagui';
import {
	TransactionType,
	TransactionTypeSegment,
} from '../src/components/TransactionTypeSegment';
import type { Item } from '../src/constants/wizardConfig';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddTransaction() {
	const [type, setType] = useState<
		TransactionType.Income | TransactionType.Expense
	>(TransactionType.Income);
	const [category, setCategory] = useState<string | null>(null);
	const [name, setName] = useState('');
	const [amount, setAmount] = useState('');
	const [date, setDate] = useState<Date | null>(null);
	const [errors, setErrors] = useState<{
		amount?: string;
		repeatValue?: string;
	}>({});

	const [expanded, setExpanded] = useState(false);
	const [categoryModalVisible, setCategoryModalVisible] = useState(false);
	const [plannedModalVisible, setPlannedModalVisible] = useState(false);
	const [selectedPlannedTxn, setSelectedPlannedTxn] = useState<Item | null>(
		null,
	);
	const [allocationAmount, setAllocationAmount] = useState('');

	const [newCategory, setNewCategory] = useState('');
	const [showSuccess, setShowSuccess] = useState(false);
	const addTransaction = useRealTransactionsStore((state) => state.add);
	const addCategory = useCategoryStore((state) => state.addCategory);
	const storeCategories = useCategoryStore();
	const plannedTransactions = usePlannedTransactionsStore(
		(state) => state.transactionsForTwoYears,
	);
	const [upcomingPlannedTransactions, setUpcomingPlannedTransactions] =
		useState<Item[]>([]);

	const [categories, setCategories] = useState<Category[]>([]);
	useEffect(() => {
		setCategories(storeCategories.categories);
	}, [storeCategories.categories]);

	const dynamicCategories = (categories || []).map((c) => ({
		key: c.id,
		label: c.name,
		type:
			c.type === 'income'
				? TransactionType.Income
				: TransactionType.Expense,
	}));

	const visibleCategories = expanded
		? dynamicCategories
		: dynamicCategories.slice(0, 3);

	useEffect(() => {
		const upcomingTxns = (plannedTransactions || []).filter((t) => {
			const txnDate = new Date(t.date);
			const now = new Date();
			now.setHours(0, 0, 0, 0);
			return txnDate >= now;
		});
		const twentyUpComingTxns = upcomingTxns
			.sort((a, b) => {
				return new Date(a.date).getTime() - new Date(b.date).getTime();
			})
			.slice(0, 20);
		setUpcomingPlannedTransactions(twentyUpComingTxns);
		console.log('Upcoming planned txns updated', twentyUpComingTxns);
	}, [plannedTransactions]);

	const handleAddCategory = async () => {
		if (!newCategory.trim()) return;

		try {
			await addCategory({
				id: Crypto.randomUUID(),
				name: newCategory,
				type: type === TransactionType.Income ? 'income' : 'expense',
				color: '#000000', // Default color
				icon: 'circle', // Default icon
			});
			setNewCategory('');
			setCategoryModalVisible(false);
		} catch (e) {
			console.error('Failed to add category:', e);
		}
	};

	const handleSelectPlanned = (txn: Item) => {
		setSelectedPlannedTxn(txn);
		setAllocationAmount(txn.amount.toString());
	};

	const confirmPlannedAllocation = () => {
		if (selectedPlannedTxn) {
			setName(selectedPlannedTxn.name);
			setAmount(allocationAmount);
			setDate(new Date(selectedPlannedTxn.date));
			setCategory(selectedPlannedTxn.category);
			setType(
				selectedPlannedTxn.type === 'income'
					? TransactionType.Income
					: TransactionType.Expense,
			);

			setPlannedModalVisible(false);
			setSelectedPlannedTxn(null);
			setAllocationAmount('');
		}
	};

	const isValidSubmit = useMemo(
		() => name.trim().length > 0 && !!date && !!amount,
		[name, amount, date],
	);

	const handleAmountChange = (newValue: string) => {
		const numeric = newValue.replace(/[^0-9.,]/g, '');
		const dotSeparators = numeric.replace(',', '.');
		const parts = dotSeparators.split('.');
		if (parts.length === 1) {
			setAmount(parts[0]);
		} else {
			const integer = parts[0];
			const decimal = parts.slice(1).join('').slice(0, 2);
			setAmount(`${integer}.${decimal}`);
		}
	};

	const handleAllocationAmountChange = (newValue: string) => {
		const numeric = newValue.replace(/[^0-9.,]/g, '');
		const dotSeparators = numeric.replace(',', '.');
		const parts = dotSeparators.split('.');
		if (parts.length === 1) {
			setAllocationAmount(parts[0]);
		} else {
			const integer = parts[0];
			const decimal = parts.slice(1).join('').slice(0, 2);
			setAllocationAmount(`${integer}.${decimal}`);
		}
	};

	const handleCancel = () => {
		setCategory(null);
		setName('');
		setAmount('');
		setDate(null);
		setErrors({});
	};

	const handleSubmit = async () => {
		// submit handler placeholder
		const newErrors: typeof errors = {};

		if (amount.at(-1) === '.') {
			newErrors.amount = 'Enter a valid amount';
		}

		setErrors(newErrors);

		/*if (Object.keys(newErrors).length === 0) {*/
		addTransaction({
			id: Crypto.randomUUID(),
			name: name,
			amount: Number(amount),
			date: date ?? new Date(),
			category: category ?? 'uncategorized',
			type: type.toLowerCase() as 'income' | 'expense',
			recurrence: 'none',
		});
		console.log({
			type,
			category,
			name,
			amount,
			date,
		});
		setShowSuccess(true);
		setName('');
		setAmount('');
		setDate(null);
		setCategory(null);
		/*}*/
	};

	return (
		<SafeAreaView style={{ flex: 1 }} edges={['left','right','bottom']}>
			<PortalProvider>
				<YStack
					style={{ height: '100%', paddingTop: 100 }}
					backgroundColor="$background"
				>
					{/* Add Category Modal */}
					{/*{categoryModalVisible && (
					<Stack
						position="absolute"
						top={0}
						bottom={0}
						left={0}
						right={0}
						backgroundColor="rgba(0, 0, 0, 0.4)"
						justifyContent="center"
						alignItems="center"
						zIndex={10}
					>
						<YStack
							backgroundColor="$white"
							borderColor={'$black'}
							borderWidth={2}
							opacity={1}
							borderRadius={16}
							padding={24}
							width={'80%'}
							gap={20}
						>
							<SizableText size={'$title1'} marginBottom={8}>
								{'Add category'}
							</SizableText>
							<Input
								value={newCategory}
								onChangeText={setNewCategory}
								placeholder={'Enter category'}
								height={40}
								borderRadius={6}
								marginBottom={22}
								focusStyle={{
									outlineColor: 'transparent',
								}}
								px="10px"
								fontSize={'$title3'}
							/>
							<XStack justifyContent="space-between">
								<Button
									onPress={() =>
										setCategoryModalVisible(false)
									}
									borderColor={'$primary200'}
									padding={22}
									alignSelf="center"
									size={42}
									fontSize={'$title3'}
								>
									<SizableText
										size={'$title3'}
										color={'$primary200'}
									>
										{'Cancel'}
									</SizableText>
								</Button>
								<Button
									onPress={handleAddCategory}
									backgroundColor={'$primary200'}
									size={42}
									padding={22}
									alignSelf="center"
									fontSize={'$title3'}
								>
									<SizableText
										size={'$title3'}
										color={'$white'}
									>
										{'Save'}
									</SizableText>
								</Button>
							</XStack>
						</YStack>
					</Stack>
					)}*/}

					{/* Pick from Planned Modal */}
					{plannedModalVisible && (
						<Stack
							position="absolute"
							top={0}
							bottom={0}
							left={0}
							right={0}
							backgroundColor="rgba(0, 0, 0, 0.4)"
							justifyContent="center"
							alignItems="center"
							zIndex={10}
						>
							<YStack
								backgroundColor="$white"
								borderColor={'$black'}
								borderWidth={2}
								opacity={1}
								borderRadius={16}
								padding={24}
								width={'90%'}
								height={'80%'}
								gap={20}
							>
								<SizableText size={'$title1'} marginBottom={8}>
									{selectedPlannedTxn
										? 'Allocate Amount'
										: 'Select a planned transaction'}
								</SizableText>

								{!selectedPlannedTxn ? (
									<ScrollView>
										<YStack gap={10}>
											{upcomingPlannedTransactions.length ===
											0 ? (
												<SizableText>
													No upcoming planned
													transactions found.
												</SizableText>
											) : (
												upcomingPlannedTransactions.map(
													(txn) => (
														<Button
															style={{
																height: 'auto',
															}}
															key={`${txn.id}-${txn.date}`}
															onPress={() =>
																handleSelectPlanned(
																	txn,
																)
															}
															padding={5}
															borderWidth={1}
															borderColor="$black"
															backgroundColor="$gray100"
															pressStyle={{
																backgroundColor:
																	'$gray200',
															}}
															justifyContent="space-between"
														>
															<YStack>
																<SizableText fontWeight="bold">
																	{txn.name}
																</SizableText>
																<SizableText
																	size="$body"
																	color="$gray500"
																>
																	{new Date(
																		txn.date,
																	).toLocaleDateString()}
																</SizableText>
															</YStack>
															<SizableText>
																{txn.type ===
																'income'
																	? 'Income'
																	: 'Expense'}
															</SizableText>
															<SizableText>
																{txn.amount} €
															</SizableText>
														</Button>
													),
												)
											)}
										</YStack>
									</ScrollView>
								) : (
									<YStack gap={20}>
										<SizableText>
											Allocating for:{' '}
											<SizableText fontWeight="bold">
												{selectedPlannedTxn.name}
											</SizableText>
										</SizableText>
										<Input
											value={allocationAmount}
											onChangeText={
												handleAllocationAmountChange
											}
											keyboardType="decimal-pad"
											placeholder="Amount to allocate"
											height={40}
											borderRadius={6}
											px="10px"
											fontSize={'$title3'}
										/>
										<XStack
											justifyContent="space-between"
											marginTop={20}
										>
											<Button
												style={{ height: '100%' }}
												onPress={() =>
													setSelectedPlannedTxn(null)
												}
												borderColor={'$primary200'}
											>
												<SizableText
													color={'$primary200'}
												>
													Back
												</SizableText>
											</Button>
											<Button
												style={{ height: '100%' }}
												onPress={
													confirmPlannedAllocation
												}
												backgroundColor={'$primary200'}
											>
												<SizableText color={'$white'}>
													Confirm
												</SizableText>
											</Button>
										</XStack>
									</YStack>
								)}

								{!selectedPlannedTxn && (
									<Button
										onPress={() =>
											setPlannedModalVisible(false)
										}
										borderColor={'$primary200'}
										style={{ height: '10%' }}
									>
										<SizableText
											style={{ height: '50%' }}
											color={'$primary200'}
										>
											Close
										</SizableText>
									</Button>
								)}
							</YStack>
						</Stack>
					)}

					<YStack style={{ height: '100%' }} alignItems="center">
						<YStack
							height="60%"
							paddingTop={24}
							paddingHorizontal={20}
							gap={18}
							justifyContent="center"
							width={'100%'}
						>
							{/* Top header */}
							<XStack alignItems="center" justifyContent="center">
								<SizableText size={'$title1'}>
									{'Add a real transaction'}
								</SizableText>
							</XStack>

							{/* Segmented: Income / Expense */}
							<YStack alignItems="center" width={'100%'} gap={10}>
								<Button
									width={'40%'}
									height={'25%'}
									size="$3"
									backgroundColor="$primary200"
									onPress={() => setPlannedModalVisible(true)}
								>
									<SizableText height={'100%'} color="$white">
										Select planned
									</SizableText>
								</Button>
								<XStack justifyContent="center">
									<TransactionTypeSegment
										type={type}
										setType={setType}
									/>
								</XStack>
							</YStack>

							{/* Category chips */}
							{/*<XStack
							justifyContent="space-between"
							alignItems="center"
						>
							<SizableText size={'$title2'}>
								{'Category'}
							</SizableText>
							<Button
								onPress={() => setExpanded(!expanded)}
								icon={expanded ? ChevronUp : ChevronDown}
								height="100%"
								background={'$transparent'}
							></Button>
						</XStack>

						{/* Add category button */}
							{/*<XStack>
							<Button
								onPress={() => setCategoryModalVisible(true)}
								icon={Plus}
								size={26}
								padding={14}
								marginRight={8}
							></Button>*/}

							{/* Visible Category Chips */}
							{/*{visibleCategories
								.filter(
									(category) =>
										(type === TransactionType.Income &&
											category.type ===
												TransactionType.Income) ||
										(type === TransactionType.Expense &&
											category.type ===
												TransactionType.Expense),
								)
								.map(({ key, label }) => {
									const selected = key === category;
									return (
										<Button
											key={key}
											onPress={() => {
												setCategory(key);
											}}
											size={28}
											padding={14}
											marginRight={8}
											backgroundColor={
												selected
													? '$primary200'
													: '$white'
											}
										>
											<SizableText size={'$title3'}>
												{label}
											</SizableText>
										</Button>
									);
								})}
						</XStack>*/}

							{/* Form */}
							<YStack
								height={'75%'}
								width={'100%'}
								borderRadius={16}
								padding={16}
								gap={6}
								backgroundColor={'$white'}
							>
								<YStack>
									<SizableText size={'$title3'}>
										{type === TransactionType.Income
											? `${TransactionType.Income} name`
											: `${TransactionType.Expense} name`}
										<SizableText size={'$title3'}>
											{' '}
											*
										</SizableText>
									</SizableText>
									<Input
										value={name}
										onChangeText={setName}
										placeholder={`${type} name`}
										height={40}
										borderRadius={6}
										focusStyle={{
											outlineColor: 'transparent',
										}}
										fontSize={'$title3'}
										px="10px"
									/>
								</YStack>

								<YStack>
									<SizableText size={'$title3'}>
										{'Amount'}
										<SizableText size={'$title3'}>
											{' '}
											*
										</SizableText>
									</SizableText>
									<Input
										value={amount}
										onChangeText={handleAmountChange}
										keyboardType="decimal-pad"
										placeholder="000,00 €"
										height={40}
										borderRadius={6}
										borderColor={
											errors.amount
												? '$danger500'
												: '$black'
										}
										focusStyle={{
											outlineColor: 'transparent',
										}}
										px="10px"
										fontSize={'$title3'}
									/>
									{errors.amount && (
										<SizableText
											size={'$title3'}
											color="$danger500"
										>
											{errors.amount}
										</SizableText>
									)}
								</YStack>

								<XStack>
									<SizableText size={'$title3'}>
										{'Date'}
										<SizableText size={'$title3'}>
											{' '}
											*
										</SizableText>
									</SizableText>

									<MultiPlatformDatePicker
										value={date}
										onChange={setDate}
									/>
								</XStack>
							</YStack>

							{/* Submit */}
							<Button
								marginTop={8}
								borderRadius={28}
								backgroundColor="$primary200"
								color="$white"
								disabled={!isValidSubmit}
								disabledStyle={{
									opacity: 0.5,
								}}
								onPress={handleSubmit}
								style={{ height: '10%' }}
							>
								<Text color={'$white'}>Submit</Text>
							</Button>

							{/* Success alert */}
							<AlertDialog
								open={showSuccess}
								onOpenChange={setShowSuccess}
							>
								<AlertDialog.Portal>
									<AlertDialog.Overlay
										opacity={0.5}
										backgroundColor={'$black'}
									/>
									<AlertDialog.Content
										bordered
										elevate
										width={'55%'}
										padding={24}
										borderRadius={16}
									>
										<SizableText size={'$title1'}>
											{'Saved'}
										</SizableText>
										<SizableText size={'$title3'}>
											{type === TransactionType.Income
												? `${TransactionType.Income} added`
												: `${TransactionType.Expense} added`}
										</SizableText>
										<XStack
											justifyContent="flex-end"
											marginTop="15"
										>
											<Button
												backgroundColor={'$primary200'}
												style={{ height: '100%' }}
												color={'$white'}
												alignSelf="center"
												onPress={() =>
													setShowSuccess(false)
												}
												fontSize={'$title3'}
											>
												<SizableText
													size={'$title3'}
													color={'$white'}
												>
													OK
												</SizableText>
											</Button>
										</XStack>
									</AlertDialog.Content>
								</AlertDialog.Portal>
							</AlertDialog>

							{/* Cancel */}
							<Button
								marginTop={8}
								borderColor={'$primary200'}
								onPress={handleCancel}
								fontSize={'$title3'}
								style={{ height: '10%' }}
							>
								<Text color={'$primary200'}>{'Cancel'}</Text>
							</Button>
						</YStack>
					</YStack>
				</YStack>
			</PortalProvider>
		</SafeAreaView>
	);
}
