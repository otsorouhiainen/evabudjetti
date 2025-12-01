import {
	Check as CheckIcon,
	ChevronDown,
	ChevronUp,
	Plus,
} from '@tamagui/lucide-icons';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import * as Crypto from 'expo-crypto';
import i18next from 'i18next';
import { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
	AlertDialog,
	Button,
	Checkbox,
	Input,
	PortalProvider,
	ScrollView,
	SizableText,
	Stack,
	XStack,
	YStack,
} from 'tamagui';
import { MultiPlatformDatePicker } from '@/src/components/MultiPlatformDatePicker';
import { db } from '@/src/db/client';
import { categories, transactions } from '@/src/db/schema';
import {
	TransactionType,
	TransactionTypeSegment,
} from '../src/components/TransactionTypeSegment';

export default function AddTransaction() {
	const [type, setType] = useState<
		TransactionType.Income | TransactionType.Expense
	>(TransactionType.Income);
	const [category, setCategory] = useState<string | null>(null);
	const [name, setName] = useState('');
	const [amount, setAmount] = useState('');
	const [date, setDate] = useState<Date | null>(null);

	const [repeat, setRepeat] = useState(false);
	const [repeatInterval, setRepeatInterval] = useState<
		'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'
	>('monthly');
	const [repeatValue, setRepeatValue] = useState('');
	const [errors, setErrors] = useState<{
		amount?: string;
		repeatValue?: string;
	}>({});

	const [description, setDescription] = useState('');
	const [expanded, setExpanded] = useState(false);
	const [categoryModalVisible, setCategoryModalVisible] = useState(false);
	const [newCategory, setNewCategory] = useState('');
	const [showSuccess, setShowSuccess] = useState(false);

	const categoriesData = useLiveQuery(db.select().from(categories));
	const dynamicCategories = (categoriesData || []).map((c) => ({
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

	const handleAddCategory = async () => {
		if (!newCategory.trim()) return;

		try {
			await db.insert(categories).values({
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

	const handleCancel = () => {
		setCategory(null);
		setName('');
		setAmount('');
		setDate(null);

		setRepeat(false);
		setRepeatInterval('monthly');
		setRepeatValue('');
		setDescription('');
		setErrors({});
	};

	const handleSubmit = async () => {
		// submit handler placeholder
		const newErrors: typeof errors = {};

		if (amount.at(-1) === '.') {
			newErrors.amount = i18next.t('Enter a valid amount');
		}
		if (
			repeat === true &&
			repeatInterval === 'custom' &&
			repeatValue === ''
		) {
			newErrors.repeatValue = i18next.t('Enter the recurrence interval');
		}

		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			try {
				await db.insert(transactions).values({
					id: Crypto.randomUUID(),
					name: name,
					amount: Number(amount),
					date: date ?? new Date(),
					categoryId: category ?? 'other',
					type: type.toLowerCase() as 'income' | 'expense',
					recurrence: repeatInterval,
					recurrenceInterval:
						repeatValue === '' ? undefined : Number(repeatValue),
					isPlanned: false,
				});
				console.log({
					type,
					category,
					name,
					amount,
					date,
					repeat,
					description,
					repeatInterval,
					repeatValue,
				});
				setShowSuccess(true);
			} catch (e) {
				console.error('Failed to add transaction:', e);
			}
		}
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<PortalProvider>
				<ScrollView
					contentContainerStyle={{
						paddingBottom: 70,
					}}
				>
					{/* Add Category Modal */}
					{categoryModalVisible && (
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
								width={'30%'}
								gap={'$4'}
							>
								<SizableText size={'$title1'} marginBottom={8}>
									{i18next.t('Add category')}
								</SizableText>
								<Input
									value={newCategory}
									onChangeText={setNewCategory}
									placeholder={i18next.t('Enter category')}
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
											{i18next.t('Cancel')}
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
											{i18next.t('Save')}
										</SizableText>
									</Button>
								</XStack>
							</YStack>
						</Stack>
					)}

					<YStack
						flex={1}
						justifyContent="center"
						alignItems="center"
						overflow="scroll"
					>
						<YStack
							flex={1}
							paddingTop={24}
							paddingHorizontal={20}
							gap={18}
							width={'100%'}
						>
							{/* Top header */}
							<SizableText size={'$title1'}>
								{i18next.t('Add new')}
							</SizableText>

							{/* Segmented: Income / Expense */}
							<XStack justifyContent="center">
								<TransactionTypeSegment
									type={type}
									setType={setType}
								/>
							</XStack>

							{/* Category chips */}
							<XStack
								justifyContent="space-between"
								alignItems="center"
							>
								<SizableText size={'$title2'}>
									{i18next.t('Category')}
								</SizableText>
								<Button
									onPress={() => setExpanded(!expanded)}
									icon={expanded ? ChevronUp : ChevronDown}
									height="100%"
									background={'$transparent'}
								></Button>
							</XStack>

							{/* Add category button */}
							<XStack>
								<Button
									onPress={() =>
										setCategoryModalVisible(true)
									}
									icon={Plus}
									size={26}
									padding={14}
									marginRight={8}
								></Button>

								{/* Visible Category Chips */}
								{visibleCategories
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
													{i18next.t(label)}
												</SizableText>
											</Button>
										);
									})}
							</XStack>

							{/* Form */}
							<YStack
								alignSelf="center"
								width={'100%'}
								borderRadius={16}
								padding={16}
								gap={6}
								backgroundColor={'$white'}
							>
								<YStack>
									<SizableText size={'$title3'}>
										{type === TransactionType.Income
											? i18next.t(
													'{{transactionType}} name',
													{
														transactionType:
															i18next.t(
																TransactionType.Income,
															),
													},
												)
											: i18next.t(
													'{{transactionType}} name',
													{
														transactionType:
															i18next.t(
																TransactionType.Expense,
															),
													},
												)}
										<SizableText size={'$title3'}>
											{' '}
											*
										</SizableText>
									</SizableText>
									<Input
										value={name}
										onChangeText={setName}
										placeholder={i18next.t(
											'{{transactionType}} name',
											{
												transactionType:
													i18next.t(type),
											},
										)}
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
										{i18next.t('Amount')}
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

								<YStack>
									<SizableText size={'$title3'}>
										{i18next.t('Date')}
										<SizableText size={'$title3'}>
											{' '}
											*
										</SizableText>
									</SizableText>

									<MultiPlatformDatePicker
										value={date}
										onChange={setDate}
									/>
								</YStack>

								<XStack alignItems="center">
									<Checkbox
										size={44}
										padding={8}
										marginRight={10}
										checked={repeat}
										onCheckedChange={(checked) =>
											setRepeat(checked === true)
										}
									>
										<Checkbox.Indicator>
											<CheckIcon size={14} />
										</Checkbox.Indicator>
									</Checkbox>

									<SizableText size={'$title3'}>
										{i18next.t('Does the event repeat?')}
									</SizableText>
								</XStack>

								{/* Repeat */}
								{repeat && (
									<XStack
										alignSelf="center"
										borderRadius={10}
										padding={4}
										gap={6}
										backgroundColor="$primary300"
									>
										{(
											[
												'daily',
												'weekly',
												'monthly',
												'yearly',
												'custom',
											] as const
										).map((opt) => (
											<Button
												key={opt}
												pressStyle={{ opacity: 0.8 }}
												padding={15}
												borderRadius={10}
												onPress={() => {
													setRepeatInterval(opt);
													if (opt !== 'custom')
														setRepeatValue('');
												}}
												backgroundColor={
													opt === repeatInterval
														? '$primary200'
														: '$white'
												}
											>
												<SizableText size={'$title3'}>
													{i18next.t(opt)}
												</SizableText>
											</Button>
										))}
									</XStack>
								)}

								{repeat && repeatInterval === 'custom' && (
									<YStack>
										<SizableText size={'$title3'}>
											{i18next.t('Repeat interval')}
											<SizableText size={'$title3'}>
												{' '}
												*
											</SizableText>
										</SizableText>
										<Input
											placeholder={i18next.t(
												'day intervals',
											)}
											value={repeatValue}
											onChangeText={setRepeatValue}
											keyboardType="numeric"
											height={40}
											borderRadius={6}
											borderColor={
												errors.repeatValue
													? '$danger500'
													: '$black'
											}
											focusStyle={{
												outlineColor: 'transparent',
											}}
											px="10px"
											fontSize={'$title3'}
										/>
										{errors.repeatValue && (
											<SizableText
												size={'$title3'}
												color="$danger500"
											>
												{errors.repeatValue}
											</SizableText>
										)}
									</YStack>
								)}
							</YStack>

							{/* Submit */}
							<Button
								marginTop={8}
								borderRadius={28}
								paddingVertical={20}
								backgroundColor="$primary200"
								color="$white"
								disabled={!isValidSubmit}
								disabledStyle={{
									opacity: 0.5,
								}}
								onPress={handleSubmit}
								fontSize={'$title3'}
							>
								<SizableText size={'$title3'} color={'$white'}>
									{type === TransactionType.Income
										? i18next.t('Add {{transactionType}}', {
												transactionType: i18next.t(
													TransactionType.Income,
												),
											})
										: i18next.t('Add {{transactionType}}', {
												transactionType: i18next.t(
													TransactionType.Expense,
												),
											})}
								</SizableText>
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
										width={'25%'}
										padding={24}
										borderRadius={16}
									>
										<SizableText size={'$title1'}>
											{i18next.t('Saved')}
										</SizableText>
										<SizableText size={'$title3'}>
											{type === TransactionType.Income
												? i18next.t(
														'{{transactionType}} added',
														{
															transactionType:
																i18next.t(
																	TransactionType.Income,
																),
														},
													)
												: i18next.t(
														'{{transactionType}} added',
														{
															transactionType:
																i18next.t(
																	TransactionType.Expense,
																),
														},
													)}
										</SizableText>
										<XStack
											justifyContent="flex-end"
											marginTop="15"
										>
											<Button
												backgroundColor={'$primary200'}
												size={42}
												color={'$white'}
												padding={22}
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
								borderRadius={28}
								paddingVertical={20}
								borderColor={'$primary200'}
								onPress={handleCancel}
								fontSize={'$title3'}
							>
								<SizableText
									size={'$title3'}
									color={'$primary200'}
								>
									{i18next.t('Cancel')}
								</SizableText>
							</Button>
						</YStack>
					</YStack>
				</ScrollView>
			</PortalProvider>
		</SafeAreaView>
	);
}
